In order to run the taibom-battery you should run [claim cascade](https://github.com/nqminds/ClaimCascade), and then configure the [claim cascade config file in the battery](Release 4/taibom-battery/claim_cascade_config.json) to point to your unprocessed input directories and root keys path for claim cascade, and set the `busy_timeout` in seconds, this is the time after which if claim cascade is not busy it is assumed that something went wrong and claim cascade is not processing your claims, typically 3 seconds is a good default value. 

It should look like:

```json
{
  "claim_cascade_root_keys_path": "<path to claim cascade's root keys directory on your local machine>",
  "busy_timeout": 3,
  "unprocessed_inference_verifiable_credentials_path": "<path to unprocessed inference verifiable credentials directory on your local machine>",
  "unprocessed_policy_verifiable_credentials_path": "<path to unprocessed policy verifiable credentials directory on your local machine>",
  "unprocessed_keys_path": "<path to unprocessed keys directory on your local machine>"
}
```

You should then run the [simulation environment](https://github.com/nqminds/simulation-environment?tab=readme-ov-file#usage) server and frontend, as described in the readme. You should then use the frontend web app to change battery folder to the taibom-battery, once done successfully you should see the [scenarios file]([scenarios](Release 4/taibom-battery/scenarios.json)) from the battery in the execute scenario screen, you should be able to select the `ETS2SignDetection Release 4` from the scenario drop down and execute it, which should load the VCs specified in the [scenarios file]([scenarios](Release 4/taibom-battery/scenarios.json)) into claim cascade and run the queries defined in the scenario, display the results of the queries in the web frontend. See below for an example screenshot of what this should look like:

![screenshot of the scenario env with the scenario executed and query results visible](screenshot_scenario_env.png)