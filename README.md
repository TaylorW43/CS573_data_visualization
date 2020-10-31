# Data Visualization Project

## Data

The data I propose to visualize for my project is the [Kaggle Privatization of Space dataset](https://www.kaggle.com/davidroberts13/one-small-step-for-data).

## Prototypes

I’ve created a proof of concept visualization of this data. 

First one is a bar chart showing the total number of launches throughout the years. The X axis is the years and Y axis shows the number of launches for that year.

[![concept1](<https://user-images.githubusercontent.com/63271980/94351007-4fa47c80-0022-11eb-8c81-db530b72dac8.png>
)](https://vizhub.com/TaylorW43/44baed18d77248a5b7be970eab5c8bda)

Second one is a also a bar chart, but it aims to show that for each country, what's the ratio of state launches and private launches. The X axis represented all the countries that exist in the dataset, and the Y axis shows for that particular country, the number of state launches and the number of private launches, these two numbers are stacked on top of each other and represented in different colors to give a more "ratio" sense.

[![concept2](<https://user-images.githubusercontent.com/63271980/94351105-51bb0b00-0023-11eb-83e5-5c610b52085c.png>
)](https://vizhub.com/TaylorW43/bdcb44f70d6a4500b3f65054adeecbd0)

## Questions & Tasks

The following tasks and questions will drive the visualization and interaction decisions for this project:

 * (Bar chart) Remade a bar chart showing total number of rocket launches throughout the years.
 [![bar_total](<https://user-images.githubusercontent.com/63271980/97769496-e7a1f400-1b01-11eb-9097-60e1b59a621a.png>
)](https://vizhub.com/TaylorW43/9ab3676390c643deabe16a9da7e7635e)
 
 * (Plot with menu) A scatter plot showing each year during which month was the launch occurred.
 * (World graph) Created a world graph that marks the location of the each individual launch location, also when clicked on one would find hidden pies.
 * (Bar chart) A bar chart showing the ratio of state/private launches for each country(Has been changed into pie form and integrated into world map).

## Sketches

###Sketch_1
![sketch1](<https://user-images.githubusercontent.com/63271980/94375137-770d4f00-00df-11eb-942d-4e5944f0e280.png>
)
Description:
In this sketch, the X axis is the year, and the Y axis is the number of launches in that paticular year. Since there are too many years and it's impossible and not wise to show them all, I added tooltip to show the year value each column have.

###Sketch_2
![sketch2](https://user-images.githubusercontent.com/63271980/95107264-ac312700-0707-11eb-9046-4f17626b69a2.png)
Description:
This is a scatter plot showing in a specific year during which month the launch occurs. The Y menu only has one choice which is Month attribute since I'm only concerned with month attribute, the X menu grouped years into groups.

###Sketch_3
![sketch3](<https://user-images.githubusercontent.com/63271980/94375141-87bdc500-00df-11eb-9d58-8188c99691d9.png>
)
Description:
In this sketch, I created a world map and each reverse triangle represents a launch place. When clicked on it would display a menu showing information about this place. Also try to find the hidden pies! Meaning, if one click on the countries, pies may pop up.

###Sketch_4
![sketch4](<https://user-images.githubusercontent.com/63271980/94375148-96a47780-00df-11eb-9243-2b688cf356d9.png>
)
Description:
In this sketch, the X axis is the Countries Categorization, and the Y axis is the number of private launches and number of state luaunches. I want to add the political ideaology of these countries, although I haven't decided in what form. Which would solve Question&Task #1.

## Schedule of Deliverables
I designed two phases to finish the final project.
### First Phase---Rough visulization(12 days)
* Estimated delivery date of first phase: Oct.18.2020
  * (Sketch_1: Number of launches in a paticular year) Since the rough visualization of this one is already been done. This one won't cost time.
  * (Sketch_2: Plot launch year/month with menus) Since the rough visualization of this one is already been done. This one won't cost time.
  * (Sketch_3: Worldmap of launch places) To me this one is the more difficult one, therefore I think it will take me 9 days to finish.
  * (Sketch_4: Ratio of state and private launches) Since the rough visualization of this one is already been done. This one won't cost time.
### Second Phase---Perfect each idea(23 days)
* Estimated delivery date of second phase: Nov.11.2020
  * I intend to spent three or four days to change the css(e.g. color,font,fill,background...) and line rendering(margin etc.) of all the visualizations. I want to use apply a universal css to all my projects therefore every each one of the sketches will be changed during this time.
  * Then I will spend about eight or nine days trying to perfect my world map visualization, see if there's anything particularly interests me and makes me want to change and try out different ideas.
  * Next I will spend about seven or eight days trying to perfect my plot with menus visualization.
  * The remaining five or six days I'll spent on perfect my other designs. Again, I want to try out different things and see which one I think is the best.

## Problems along the way
After I spent time trying to figure out how to do pie chart, I actually found out that the dataset I have isn't suitable for this kinda of visualization. Therefore I had to delete this from my project schedule. However due to this I decided to add more functions to my other visualizations.

## Future work
* I intend to change my scatter plot, right now it shows the launch month of each year, one problem with it is almost every month have launches, therefore the whole plot is kind of hard to see for human eyes, I'm thinking of changing it to display months in which no launch occurred.

