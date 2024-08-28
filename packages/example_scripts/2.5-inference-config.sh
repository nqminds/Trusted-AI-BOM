npm run --prefix compose-taibom-claim compose-taibom-claim -- \
  --schema "../../schemas/src/config.v1.0.0.schema.yaml" \
  --hash $(tar c ./path/to/weights.pkl | sha256sum | awk '{print $1}') \
  --id $(uuidgen)
# define dependancies interactively