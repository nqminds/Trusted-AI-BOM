import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report, accuracy_score
from sklearn.preprocessing import LabelEncoder

# Load the dataset
input_file = '../training_data.csv'  # Replace with your training CSV file path
data = pd.read_csv(input_file)

# Display the first few rows of the dataframe
print("Original Data:")
print(data.head())

# Identify date columns and convert them to datetime format
date_columns = ['bite_date', 'vaccination_date', 'quarantine_date', 'head_sent_date', 'release_date']
for col in date_columns:
    data[col] = pd.to_datetime(data[col], errors='coerce')

# Example: Extracting year from date columns
for col in date_columns:
    data[col + '_year'] = data[col].dt.year

# Drop the original date columns (keep only the extracted features)
data = data.drop(columns=date_columns)

# Fill missing values for categorical columns with a placeholder, e.g., 'Unknown'
# For numerical columns, use the median to fill missing values
for column in data.columns:
    if data[column].dtype == 'object':
        data[column] = data[column].fillna('Unknown')
    elif data[column].dtype in ['int64', 'float64']:
        data[column] = data[column].fillna(data[column].median())

# Encode categorical variables
label_encoders = {}
for column in data.columns:
    if data[column].dtype == 'object':
        le = LabelEncoder()
        data[column] = le.fit_transform(data[column].astype(str))
        label_encoders[column] = le

# Extract features (X) and target (y)
# Assuming 'DispositionIDDesc' is the target variable to predict
X = data.drop(columns=['DispositionIDDesc'])
y = data['DispositionIDDesc']

# Split the dataset into training and testing sets (80-20 split)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a Decision Tree Classifier
model = DecisionTreeClassifier(random_state=42)
model.fit(X_train, y_train)

# Predict on the test set
y_pred = model.predict(X_test)

# Evaluate the model
print("Model Accuracy:", accuracy_score(y_test, y_pred))

# Suppress warnings in classification report using zero_division=0
print("\nClassification Report:\n", classification_report(y_test, y_pred, zero_division=0))
