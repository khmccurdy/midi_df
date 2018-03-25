# Midi DF

Midi DF is a Python "library" (well, just a .py file with some functions in it for now) for converting midi data into DataFrames containing information on each chord in the midi file. DataFrames can be exported as JSON to facilitate use in external applications. Chords are stored as lists of midi pitches. Further reading on "dyads" and "interval classes", as well as the visualization technique that inspired this project, can be found [here](http://www.musanim.com/mam/dyad.htm).

Required libraries are pandas (0.20.3), numpy (1.13.3), and [midi](https://github.com/louisabraham/python3-midi) (0.2.3).

## Demo
In short, `midi.read_midifile()` --> [`tempo_map()` -->] `midi_to_df()` --> `condense_df()` --> [`merge_df()` -->] `output_json()`.
### Dependencies


```python
import json
import pandas as pd
import numpy as np
import midi
import copy

import midi_df as mdf
```

### Load a midi file using the "midi" library


```python
kiev = midi.read_midifile("kiev.mid")
```

### Print the summary table


```python
kiev_s = mdf.track_summary(kiev)
kiev_s
```




<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Track Name</th>
      <th>Channel</th>
      <th>Note Events</th>
      <th>Tempo Track</th>
      <th>Instrument ID</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>The Great Gate of Kiev</td>
      <td></td>
      <td>0</td>
      <td>tempo track</td>
      <td>{}</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Staff</td>
      <td>0</td>
      <td>2790</td>
      <td></td>
      <td>{0}</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Staff-1</td>
      <td>1</td>
      <td>2032</td>
      <td></td>
      <td>{0}</td>
    </tr>
  </tbody>
</table>
</div>



We can see that Track 0 is the tempo track, and Tracks 1 & 2 have note data on channels 0 and 1, both with instrument 0 (Acoustic Piano in the GM standard). 

### Get the tempo map

Since Track 0 is the default for `ch`, we don't need to specify it in the parameters for `tempo_df()`.


```python
kiev_tempo = mdf.tempo_df(kiev)
kiev_tempo.head(10)
```




<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Tick</th>
      <th>uSec/tick</th>
      <th>Time (uSec)</th>
      <th>Time (sec)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>0</td>
      <td>2403.843750</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>1</th>
      <td>16128</td>
      <td>2604.166667</td>
      <td>38769192</td>
      <td>38.769192</td>
    </tr>
    <tr>
      <th>2</th>
      <td>22272</td>
      <td>2403.843750</td>
      <td>54769192</td>
      <td>54.769192</td>
    </tr>
    <tr>
      <th>3</th>
      <td>35328</td>
      <td>2314.812500</td>
      <td>86153776</td>
      <td>86.153776</td>
    </tr>
    <tr>
      <th>4</th>
      <td>46950</td>
      <td>2332.088542</td>
      <td>113056527</td>
      <td>113.056527</td>
    </tr>
    <tr>
      <th>5</th>
      <td>47052</td>
      <td>2349.619792</td>
      <td>113294400</td>
      <td>113.294400</td>
    </tr>
    <tr>
      <th>6</th>
      <td>47155</td>
      <td>2367.421875</td>
      <td>113536411</td>
      <td>113.536411</td>
    </tr>
    <tr>
      <th>7</th>
      <td>47257</td>
      <td>2385.494792</td>
      <td>113777888</td>
      <td>113.777888</td>
    </tr>
    <tr>
      <th>8</th>
      <td>47360</td>
      <td>2403.843750</td>
      <td>114023594</td>
      <td>114.023594</td>
    </tr>
    <tr>
      <th>9</th>
      <td>47462</td>
      <td>2422.479167</td>
      <td>114268786</td>
      <td>114.268786</td>
    </tr>
  </tbody>
</table>
</div>



### Create the first midi DataFrame (Track 1)


```python
kiev_df1 = mdf.midi_to_df(kiev,1,kiev_tempo)
kiev_df1.head(15)
```




<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>dTicks</th>
      <th>Tick</th>
      <th>Pitch</th>
      <th>On/Off</th>
      <th>Playing</th>
      <th>Time (s)</th>
      <th>Beat</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>0</td>
      <td>0</td>
      <td>NaN</td>
      <td>None</td>
      <td>[]</td>
      <td>0.000000</td>
      <td>0.00</td>
    </tr>
    <tr>
      <th>1</th>
      <td>0</td>
      <td>0</td>
      <td>NaN</td>
      <td>None</td>
      <td>[]</td>
      <td>0.000000</td>
      <td>0.00</td>
    </tr>
    <tr>
      <th>2</th>
      <td>0</td>
      <td>0</td>
      <td>NaN</td>
      <td>None</td>
      <td>[]</td>
      <td>0.000000</td>
      <td>0.00</td>
    </tr>
    <tr>
      <th>3</th>
      <td>0</td>
      <td>0</td>
      <td>NaN</td>
      <td>None</td>
      <td>[]</td>
      <td>0.000000</td>
      <td>0.00</td>
    </tr>
    <tr>
      <th>4</th>
      <td>0</td>
      <td>0</td>
      <td>NaN</td>
      <td>None</td>
      <td>[]</td>
      <td>0.000000</td>
      <td>0.00</td>
    </tr>
    <tr>
      <th>5</th>
      <td>0</td>
      <td>0</td>
      <td>63.0</td>
      <td>on</td>
      <td>[63]</td>
      <td>0.000000</td>
      <td>0.00</td>
    </tr>
    <tr>
      <th>6</th>
      <td>0</td>
      <td>0</td>
      <td>67.0</td>
      <td>on</td>
      <td>[63, 67]</td>
      <td>0.000000</td>
      <td>0.00</td>
    </tr>
    <tr>
      <th>7</th>
      <td>0</td>
      <td>0</td>
      <td>70.0</td>
      <td>on</td>
      <td>[63, 67, 70]</td>
      <td>0.000000</td>
      <td>0.00</td>
    </tr>
    <tr>
      <th>8</th>
      <td>0</td>
      <td>0</td>
      <td>75.0</td>
      <td>on</td>
      <td>[63, 67, 70, 75]</td>
      <td>0.000000</td>
      <td>0.00</td>
    </tr>
    <tr>
      <th>9</th>
      <td>720</td>
      <td>720</td>
      <td>63.0</td>
      <td>off</td>
      <td>[67, 70, 75]</td>
      <td>1.730767</td>
      <td>3.75</td>
    </tr>
    <tr>
      <th>10</th>
      <td>0</td>
      <td>720</td>
      <td>67.0</td>
      <td>off</td>
      <td>[70, 75]</td>
      <td>1.730767</td>
      <td>3.75</td>
    </tr>
    <tr>
      <th>11</th>
      <td>0</td>
      <td>720</td>
      <td>70.0</td>
      <td>off</td>
      <td>[75]</td>
      <td>1.730767</td>
      <td>3.75</td>
    </tr>
    <tr>
      <th>12</th>
      <td>0</td>
      <td>720</td>
      <td>75.0</td>
      <td>off</td>
      <td>[]</td>
      <td>1.730767</td>
      <td>3.75</td>
    </tr>
    <tr>
      <th>13</th>
      <td>48</td>
      <td>768</td>
      <td>65.0</td>
      <td>on</td>
      <td>[65]</td>
      <td>1.846152</td>
      <td>4.00</td>
    </tr>
    <tr>
      <th>14</th>
      <td>0</td>
      <td>768</td>
      <td>70.0</td>
      <td>on</td>
      <td>[65, 70]</td>
      <td>1.846152</td>
      <td>4.00</td>
    </tr>
  </tbody>
</table>
</div>



### Condense the DataFrame (Track 1)


```python
kiev_c1 = mdf.condense_df(kiev_df1)
kiev_c1.head()
```




<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Beat</th>
      <th>Time (s)</th>
      <th>Playing</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>8</th>
      <td>0.00</td>
      <td>0.000000</td>
      <td>[63, 67, 70, 75]</td>
    </tr>
    <tr>
      <th>12</th>
      <td>3.75</td>
      <td>1.730767</td>
      <td>[]</td>
    </tr>
    <tr>
      <th>16</th>
      <td>4.00</td>
      <td>1.846152</td>
      <td>[65, 70, 74, 77]</td>
    </tr>
    <tr>
      <th>20</th>
      <td>7.75</td>
      <td>3.576919</td>
      <td>[]</td>
    </tr>
    <tr>
      <th>24</th>
      <td>8.00</td>
      <td>3.692304</td>
      <td>[67, 70, 75, 79]</td>
    </tr>
  </tbody>
</table>
</div>



### Create and condense the DataFrame for Track 2 in one line


```python
kiev_c2 = mdf.condense_df(mdf.midi_to_df(kiev,2,kiev_tempo))
kiev_c2.head()
```




<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Beat</th>
      <th>Time (s)</th>
      <th>Playing</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>8</th>
      <td>0.00</td>
      <td>0.000000</td>
      <td>[43, 46, 51, 55]</td>
    </tr>
    <tr>
      <th>12</th>
      <td>3.75</td>
      <td>1.730767</td>
      <td>[]</td>
    </tr>
    <tr>
      <th>16</th>
      <td>4.00</td>
      <td>1.846152</td>
      <td>[41, 46, 50, 53]</td>
    </tr>
    <tr>
      <th>20</th>
      <td>7.75</td>
      <td>3.576919</td>
      <td>[]</td>
    </tr>
    <tr>
      <th>24</th>
      <td>8.00</td>
      <td>3.692304</td>
      <td>[39, 43, 46, 51]</td>
    </tr>
  </tbody>
</table>
</div>



### Merge the DataFrames for Track 1 and 2


```python
kiev_m = mdf.merge_tracks([kiev_c1, kiev_c2],[1,2])
kiev_m.head()
```




<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Beat</th>
      <th>Time (s)</th>
      <th>Playing 1</th>
      <th>Playing 2</th>
      <th>Playing</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>0.00</td>
      <td>0.000000</td>
      <td>[63, 67, 70, 75]</td>
      <td>[43, 46, 51, 55]</td>
      <td>[67, 70, 43, 75, 46, 51, 55, 63]</td>
    </tr>
    <tr>
      <th>1</th>
      <td>3.75</td>
      <td>1.730767</td>
      <td>[]</td>
      <td>[]</td>
      <td>[]</td>
    </tr>
    <tr>
      <th>2</th>
      <td>4.00</td>
      <td>1.846152</td>
      <td>[65, 70, 74, 77]</td>
      <td>[41, 46, 50, 53]</td>
      <td>[65, 70, 41, 74, 77, 46, 50, 53]</td>
    </tr>
    <tr>
      <th>3</th>
      <td>7.75</td>
      <td>3.576919</td>
      <td>[]</td>
      <td>[]</td>
      <td>[]</td>
    </tr>
    <tr>
      <th>4</th>
      <td>8.00</td>
      <td>3.692304</td>
      <td>[67, 70, 75, 79]</td>
      <td>[39, 43, 46, 51]</td>
      <td>[67, 70, 39, 75, 43, 46, 79, 51]</td>
    </tr>
  </tbody>
</table>
</div>



### All main DataFrame steps in one line


```python
mdf.merge_tracks([mdf.condense_df(mdf.midi_to_df(kiev, t, kiev_tempo)) for t in [1,2]]).head()
```




<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Beat</th>
      <th>Time (s)</th>
      <th>Playing 1</th>
      <th>Playing 2</th>
      <th>Playing</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>0.00</td>
      <td>0.000000</td>
      <td>[63, 67, 70, 75]</td>
      <td>[43, 46, 51, 55]</td>
      <td>[67, 70, 43, 75, 46, 51, 55, 63]</td>
    </tr>
    <tr>
      <th>1</th>
      <td>3.75</td>
      <td>1.730767</td>
      <td>[]</td>
      <td>[]</td>
      <td>[]</td>
    </tr>
    <tr>
      <th>2</th>
      <td>4.00</td>
      <td>1.846152</td>
      <td>[65, 70, 74, 77]</td>
      <td>[41, 46, 50, 53]</td>
      <td>[65, 70, 41, 74, 77, 46, 50, 53]</td>
    </tr>
    <tr>
      <th>3</th>
      <td>7.75</td>
      <td>3.576919</td>
      <td>[]</td>
      <td>[]</td>
      <td>[]</td>
    </tr>
    <tr>
      <th>4</th>
      <td>8.00</td>
      <td>3.692304</td>
      <td>[67, 70, 75, 79]</td>
      <td>[39, 43, 46, 51]</td>
      <td>[67, 70, 39, 75, 43, 46, 79, 51]</td>
    </tr>
  </tbody>
</table>
</div>



### Calculate the maximum chord size


```python
print("Maximum chord size:",mdf.max_notes(kiev_m))
print("Dyads in maximum chord:", mdf.max_dyads(kiev_m))
```

    Maximum chord size: 11
    Dyads in maximum chord: 55.0
    

### Display the maximum count of each interval


```python
mdf.max_dyad_counts(kiev_m)
```




    0      14
    1       9
    2      12
    3      15
    4      16
    5      15
    6       4
    sum    55
    dtype: int64



Note that "sum" refers to the maximum of the sums of dyads (not the sum of the maxima), equal to the output of `max_dyads()`. 

## Sample of Track Summary with more instruments


```python
mdf.track_summary(fake_sample_file, recommend=True)
```

    Recommended tracks: [1,2,3,4,6]
    




<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Track Name</th>
      <th>Channel</th>
      <th>Note Events</th>
      <th>Tempo Track</th>
      <th>Instrument ID</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>A Song</td>
      <td></td>
      <td>0</td>
      <td>tempo track</td>
      <td>{}</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Guitar 1</td>
      <td>0</td>
      <td>3234</td>
      <td></td>
      <td>{25}</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Guitar 2</td>
      <td>1</td>
      <td>1847</td>
      <td></td>
      <td>{26, 29}</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Keyboard - Square Wave</td>
      <td>2</td>
      <td>376</td>
      <td></td>
      <td>{80}</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Organ</td>
      <td>3</td>
      <td>1429</td>
      <td></td>
      <td>{18}</td>
    </tr>
    <tr>
      <th>5</th>
      <td>Drum Kit</td>
      <td>9</td>
      <td>2308</td>
      <td></td>
      <td>{0}</td>
    </tr>
    <tr>
      <th>6</th>
      <td>Flute Solo</td>
      <td>10</td>
      <td>145</td>
      <td></td>
      <td>{73}</td>
    </tr>
  </tbody>
</table>
</div>



We can see that the author of this midi file has named their tracks by instrument. From here, we can determine which set of tracks we wish to use in our DataFrame. For example, if we only want to output guitars we would use Tracks 1 and 2, or if we wanted the whole band, we would copy the "Recommended tracks" list. Track 5 is a percussion track, set to midi channel 9, so we can assume it does not carry useful melodic information. 
