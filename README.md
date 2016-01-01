# jnr
Offline first jigsnreels webapp
Name for app - speed the plough, trad tutor

# Pages

## TODO
- suggest new tune
- create tune
- delete tune
- save custom transition
- make practices more intelligent with regard to keys
- ... in fact handle keys more intelligently full stop

3 lists

- learn: tunes that have never been above the threshold score - sorted by last practiced date and score. Arranged as single tunes
- perfect: tunes that aren't consistently above the threshold - sorted by last practiced date and avg score. Arranged as small sets
- rehearse: tues that are consistently above the threshold, sorted by last practiced date. Arranged as full sets
threshold = 7/10 ?

Home page is top item(s) from each, + suggestion of new tune + suggestion of new transition



(scrap the stuff below in favour of the above)

Each tune can be a piece (tune + key + arrangement)
Tunes can be auto-prompoted to a piece if no pieces created in a while
Each piece can be part of one or more sets
Sets can be rated for quality (nice to have)
These sets define, implicitly, which tunes can go before or after each other

Each practice should have an urgency property 1 - 10
Setting urgency overwrites the previous value



# Learning list
Pieces are ordered by timeSincePastPractice * urgency (or some other function of these values)
The piece with the highest value is chosen first
A piece which appears either before or after it in a set with urgency > x is placed in a set with it
repeat until max 3 tunes
However if piece has urgency > X make sure it is practiced alone

In UI, pressing and holding a tune increases its urgency
If any tunes left in the row the row can be dismissed. Their urgency is set to Math.max(u/2, 1)

# Rehearsal list
Tunes with urgency < x are grouped similarly to the learning list
Will also favour sets defined by the user adn allow the user to promote the suggested groupings to sets
Will also 'go off road' and bundle potentially good combinations together

# Arranging list
Performs function similar to set builder

Pieces can be marked as standalone, in which case the user won't be nagged to group with other tunes

