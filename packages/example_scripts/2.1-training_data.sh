npm run --prefix compose-taibom-claim compose-taibom-claim -- \
  --schema "../../schemas/src/local-data.v1.0.0.schema.yaml"\
  --hash $(tar c ./path/to/training_data | sha256sum | awk '{print $1}')\
  --id $(uuidgen)\
  --interactive false