npm run --prefix compose-taibom-claim compose-taibom-claim -- \
  --schema "../../schemas/src/author.v1.0.0.schema.yaml" \
  --id $(uuidgen)\
  --subject 00000000-0000-0000-0000-000000000001\
  --role uploader\
  --identity ash@nquiringminds.com\
  --interactive false
