import sys
import requests
import csv
import time

api_key = sys.argv[1]
page_no = 1
full_list = []

while len(full_list) < 300:
	url = "https://api.themoviedb.org/3/discover/movie?api_key=" + str(api_key) + "&sort_by=popularity.desc&include_video=false&page=" + str(page_no) + "&primary_release_date.gte=2000&with_genres=35"

	payload = "{}"
	response = requests.request("GET", url, data=payload)

	full_list += (response.json())['results']
	page_no += 1

with open('movie_ID_name.csv','w', encoding = 'utf-8') as csvfile:
	for i in range(0, len(full_list)):
		csvfile.write(str(full_list[i]['id']) + ',' + '\"' + full_list[i]['title'] + '\"\n')

sim_movies = []
c = 0
for i in range(0, len(full_list)):
	url = "https://api.themoviedb.org/3/movie/" + str(full_list[i]['id']) + "/similar?api_key=" + str(api_key) + "&page=1"
	payload = "{}"
	response = requests.request("GET", url, data=payload)
	c = 0
	for item in ((response.json())['results']):
		c = c + 1
		sim_movies.append((full_list[i]['id'], item['id']))
		if c == 5:
			break
	# if c < 5:
	# 	print(str(i) + "," + str(full_list[i]['id']))

	if int(response.headers['X-RateLimit-Remaining']) == 0:
		time.sleep(11)

final_sim = []
for a,b in sim_movies:
	if (b,a) in sim_movies and a < b:
		final_sim.append((a,b)) 
	elif (b,a) in sim_movies and b < a:
		final_sim.append((b,a))
	else:
		final_sim.append((a,b))

final_sim = set(final_sim)

with open('movie_ID_sim_movie_ID.csv','w') as csvfile:
	for item in final_sim:
		csvfile.write(str(item[0]) + ',' + str(item[1]) + '\n')