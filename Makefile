start:
	web-ext run --firefox=firefoxdeveloperedition --arg="--new-tab=https://www.youtube.com/watch?v=QmfhG8xaa3k"
docs:
	web-ext docs
build: 
	web-ext build