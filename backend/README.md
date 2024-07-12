# Quizzes App backend

## Prerequisites
- Python >= 3.9 installed and available in PATH

## Up and running
1. Setup virtualenv for the project:
```shell
python -m venv venv
```
2. Activate venv:
```shell
source venv/bin/activate
```
3. Install requirements:
```shell
pip install -r requirements.txt
```
4. Run the next command in the terminal:
```shell
./startup.sh
```
It will create database, migrate it and fill with predefined quizzes fixtures.
5. Run the development server:
```shell
python ./manage.py runserver
```
