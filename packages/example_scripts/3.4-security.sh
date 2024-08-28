npm run --prefix compose-taibom-claim compose-taibom-claim -- \
  --schema "../../schemas/src/security.v1.0.0.schema.yaml" \
  --id $(uuidgen)\
  --subject 00000000-0000-0000-0000-000000000001\
  --cveManifest "$(awk '{printf "%s", $0}' ./vulnerability_report.txt)"\
  --interactive false