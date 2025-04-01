import pandas as pd
from sklearn.model_selection import train_test_split

# Load the CSV file
input_file = 'Health_AnimalBites.csv'  # Replace with your CSV file path
data = pd.read_csv(input_file)

# Perform an 80-20 split
train_data, validation_data = train_test_split(data, test_size=0.2, random_state=42)

# Save the split data to new CSV files
train_data.to_csv('./path/to/train_data.csv', index=False)
validation_data.to_csv('./path/to/validation_data.csv', index=False)

print("Data split successfully into train_data.csv (80%) and test_data.csv (20%)")
