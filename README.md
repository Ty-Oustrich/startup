# How basic is your music taste?

How basic is your music taste is a website that connects with the spotify API to determine how plain someones listening experience is. Someone who listens only to popular artists like Drake, Taylor Swift, Bad Bunny,may be described as basic. If you listen only to deep cuts, music that is less popular or from obscure artitst you are less basic.



## 🚀 Specification Deliverable


For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] Proper use of Markdown
- [x] A concise and compelling elevator pitch
- [x] Description of key features
- [x] Description of how you will use each technology
- [x] One or more rough sketches of your application. Images must be embedded in this file using Markdown image references.

### Elevator pitch


Do you listen to the same music as everyone else? With "How basic is your music?" you can connect your spotify account and find out how unique you are. You will get a score that tells you if you are a part of the underground scene enjoying deep cuts and obscure songs, or if your only enjoying mainstream sounds. You will get a pulse on your listening profile and be able to share it with your friends. What type of listener are you? Who in your friend group has the most basic music taste?



### Design

![Design image](design1.png)
![Design image](design2.png)



### Key features
- Secure login over HTTPS
- Validates Spotify login
- Querys spotify for user data upon succesful login
- displays a score for every user based on their data
- all results are stored, a percentile will display how your score compares to all others who have used the website.


### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Three HTML pages, login, starting page, leaderboard where percentile for your score will be displayed.
- **CSS** - Displays a clean ui, including use of my logo and colors. Large text box to emphasize the score and percentile.
- **React** - processes Login, api query, score and percentile display.
- **Web service** - Backend service for:
- login
- Spotify api integration
- process score with algorithm
- **DB/Login** - stores each score with the corresponding username to perpetuate accurate percentile calculation for each new user. Stores username only with succesful login.
- **WebSocket** - Users will see live updates on the loading bar as their score is being calculated ex. "connecting with spotify", "sorting data", "crunching the numbers" etc.

## 🚀 AWS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Server deployed and accessible with custom domain name** - [My server link](https://musictaste.click/)

## 🚀 HTML deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **HTML pages** - Added index.html, explain-start.html, leaderboard.html and about.html pages
- [x] **Proper HTML element usage** - Used all required html elements, including BODY, NAV, MAIN, HEADER, FOOTER in each page
- [x] **Links** - I added links between all pages vie nav tag.
- [x] **Text** - Added textual explaination of the website, what it does. to index.html. And a placeholder in about.html for further explaination. 
- [x] **3rd party API placeholder** - Spotify api integration for login, I added a placeholder button and some started code.
- [x] **Images** - Added image placeholders to all four html files in the header tag
- [x] **Login placeholder** - Login placeholder button, "log in with spotify"
- [x] **DB data placeholder** - in Leaderboard.html the list is where the placeholder for the database data will be displayed
- [x] **WebSocket placeholder** - added websocket placeholders for loading bar, score, and classification of taste. In explain-start.html And for the leaderboard in Leaderboard.html

## 🚀 CSS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Header, footer, and main content body** - Header includes a title and image for each page. The header also contains the nav bar
- [x] **Navigation elements** - I made a simple navigation bar that navigates to my 4 html pages. Login, analyze, leaderboard, about.
- [x] **Responsive to window resizing** - The bootsrap framework makes this easy. i ncluded the javascript responsiveness bundle at the end of each body tag on all pages. My meta tag makes sure mobile renders at 1:1. I used the boostrap grid system. My imgage uses img-fluid which makes it scale. The large text at the top gets smaller to fit a small window. All elements stay centered with resizing.
Bootstrap uses flexboxes heavily.
- [x] **Application elements** - I made a nice looking login button for spotify, and also an analyze button. I made a spot for the leaderboard to go
- [x] **Application text content** - I made a simple description of the algorithm in the about tab, this is what my app will use to determine someones music taste.
- [x] **Application images** - I added my musictaste image to each page, centered, as well as the favicon.

## 🚀 React part 1: Routing deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Bundled using Vite** - I did not complete this part of the deliverable.
- [ ] **Components** - I did not complete this part of the deliverable.
- [ ] **Router** - Routing between login and voting components.

## 🚀 React part 2: Reactivity

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **All functionality implemented or mocked out** - I did not complete this part of the deliverable.
- [ ] **Hooks** - I did not complete this part of the deliverable.

## 🚀 Service deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Node.js/Express HTTP service** - I did not complete this part of the deliverable.
- [ ] **Static middleware for frontend** - I did not complete this part of the deliverable.
- [ ] **Calls to third party endpoints** - I did not complete this part of the deliverable.
- [ ] **Backend service endpoints** - I did not complete this part of the deliverable.
- [ ] **Frontend calls service endpoints** - I did not complete this part of the deliverable.

## 🚀 DB/Login deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **User registration** - I did not complete this part of the deliverable.
- [ ] **User login and logout** - I did not complete this part of the deliverable.
- [ ] **Stores data in MongoDB** - I did not complete this part of the deliverable.
- [ ] **Stores credentials in MongoDB** - I did not complete this part of the deliverable.
- [ ] **Restricts functionality based on authentication** - I did not complete this part of the deliverable.

## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Backend listens for WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Frontend makes WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Data sent over WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **WebSocket data displayed** - I did not complete this part of the deliverable.
- [ ] **Application is fully functional** - I did not complete this part of the deliverable.
