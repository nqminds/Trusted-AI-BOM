npm run --prefix compose-taibom-claim compose-taibom-claim -- \
  --schema "../../schemas/src/software.v1.0.0.schema.yaml" \
  --hash $(tar c ./path/to/software | sha256sum | awk '{print $1}') \
  --id $(uuidgen) \
  --sbom "$(awk '{printf "%s", $0}' ./kernel-sbom-3.json)"\
  --interactive false