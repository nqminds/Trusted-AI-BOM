npm run --prefix compose-taibom-claim compose-taibom-claim -- \
  --schema "../../schemas/src/transparency.v1.0.0.schema.yaml" \
  --id $(uuidgen)\
  --subject 00000000-0000-0000-0000-000000000001\
  --transparency This data on smoking related illnesses was collected with the aid of the association, British American Tobacco.\
  --interactive false
