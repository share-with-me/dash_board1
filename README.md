This example makes use of flask to make a python server to run the data queried from mongoDB.<br/>
1. Install the dependencies using<br/>
	pip install -r requirements.txt <br/>
2. Download MongoDB. The link is <a href = "https://www.mongodb.org/downloads#production">this</a>.<br/>
3. Install MongoDB. The link for installation procedure is <a href = "https://docs.mongodb.org/manual/installation/">this</a>.  <br/>
4. Now navigate to the folder where you installed MongoDB and locate the bin folder. Start the mongoDB server by typing in ./mongod <br> If you fund an error stating that /data/db not found, make a directory under root directory named data containing db by typing in:<br/>
     sudo mkdir -p /data/db <br/>
5. Keep the terminal running as is and open up a new terminal. Navigate again to the same directory (bin) and import the dataset in this directory by typing in <br>
   ./mongoimport -d donorschoose -c projects --type csv --headerline --file /pathto/sampledata.csv<br/>
6. Open a terminal and navigate to current directory.
7. Run the app by:<br/>
	python app.py<br/>
8. In your browser, type 0.0.0.0:8080 <br/><br/>

This repo also contains <b>Dashboard3:</b><br/>
It makes use of dc.js and crossfilter.js to visualise the json data. To run it, simply download the files and run the visualise.html file. It does not require any server running. A video of the demonstration for dashboard3 can be found <a href = "https://drive.google.com/open?id=0BwrSYlOsMCyWMGxRYllfeEgxWDQ">here </a>.<br/><br/>
In addition, the directory <b>'dashboard4'</b> consists of yet another dashboard made using dc.js, d3.js and crossfilter.js. To run it, simply download the files and click on visualise.html and view the dashboard in your browser. A video of demonstration of this dashboard can be found at <a href = "https://drive.google.com/open?id=0BwrSYlOsMCyWS0JxcFhOcFNsazQ"> here. </a><br/>
