#!/bin/bash
rm db.sqlite3 && ./manage.py makemigrations && ./manage.py migrate && ./manage.py loaddata quizzes/fixtures/quizzes.json
