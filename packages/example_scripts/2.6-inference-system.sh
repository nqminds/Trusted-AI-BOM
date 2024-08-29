npm run --prefix compose-taibom-claim compose-taibom-claim -- \
  --schema "../../schemas/src/inference-system.v1.0.0.schema.yaml" \
  --id $(uuidgen)
# define dependancies interactively