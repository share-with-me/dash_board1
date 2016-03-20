This example makes use of flask to make a python server to run the data queried from mongoDB.<br/>
1. Install the dependencies using<br/>
	pip install -r requirements.txt <br/>
2. Download MongoDB. The link is <a href = "https://www.mongodb.org/downloads#production">this</a>.<br/>
3. Install MongoDB. The link for installation procedure is <a href = "https://docs.mongodb.org/manual/installation/">this</a>.  <br/>
4. Now navigate to the folder where you installed MongoDB and locate the bin folder. Start the mongoDB server by typing in ./mongo <br>
5. Keep the terminal running as is and open up a new terminal. Navigate again to the same directory (bin) and import the dataset in this directory by typing in <br>
   ./mongoimport -d donorschoose -c projects --type csv --headerline --file /pathto/sampledata.csv<br/>
6. Open a terminal and navigate to current directory.
7. Run the app by:<br/>
	python app.py<br/>
8. In your browser, type 0.0.0.0:8080 
