FROM python:3.10

WORKDIR /backend

COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY . .

#CMD [ "python", "initdb-dev.py" , "pbrsuperadmin@ncsu.edu", "C0ck@D00dleD00" ]
#
#RUN sleep 20;

CMD [ "pytest", "--cov=src", "tests/" ]

#CMD [ "python", "server.py" ]