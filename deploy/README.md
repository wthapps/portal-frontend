## HOW TO START WITH COMMANDS
 1. Go to folder contains w_env_path.sh & web_deploy.sh
 2. Update VARIABLES' value path and name in w_env_path.sh file
 3. Run below commands
    
    ```shell
    source ./w_env_path.sh       
    source ./web_deploy.sh
    
    # deploy multiple modules
    w_release_web test "portal my-account media chat contact note social drive"
    
    # deploy one module
    w_release_web test "portal"
     
    ```