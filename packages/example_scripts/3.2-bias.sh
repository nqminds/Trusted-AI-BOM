npm run --prefix compose-taibom-claim compose-taibom-claim -- \
  --schema "../../schemas/src/bias.v1.0.0.schema.yaml" \
  --id $(uuidgen)\
  --subject 00000000-0000-0000-0000-000000000001\
  --bias Training data for a facial recognition algorithm that over-represents white people\
  --interactive false
