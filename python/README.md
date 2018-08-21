# Requirements
This program run on python3.
Use `$ which python3` to verify that you have python3 installed
# Install
## With virtualenv (recommended)
In this directory, do the following:<br>
    Install virtualenv `$ pip install virtualenv`<br>
    Get python3 path `$ export PYTHON3_PATH=$(which python3)`<br>
    Create virtualenv `$ virtualenv -p $PYTHON3_PATH install`<br>
    To use (activate) virtualenv `$ source install/bin/activate`<br>
    Install dependences `$ pip install -r requirements.txt`<br>
    To run any python script, you can use `$ python script-name.py` or `$ python3 script-name.py`<br>
    To end (deactivate) virtualenv `$ deactivate`<br>

## Without virtualenv (not recommended)
Install dependences `$ pip3 install -r requirements.txt`<br>
To run any python script `python3 script-name.py`<br>
## For Developer
If you are using vscode you may want to add the following to your setting.json in your workspace
```json
{
    "python.linting.pylintEnabled": true,
    "python.linting.enabled": true,
    "python.formatting.provider": "autopep8",
    "java.configuration.updateBuildConfiguration": "automatic",
    "git.ignoreLimitWarning": true,
    "python.linting.pylintPath": "./python/install/bin/pylint"
}
```