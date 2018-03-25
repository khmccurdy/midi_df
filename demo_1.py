#Dependencies

import json
import pandas as pd
import numpy as np
import midi
import copy

import midi_df as mdf

#Load midi file "kiev.mid" with the "midi" library

kiev = midi.read_midifile("kiev.mid")

#Print the summary table
kiev_s = mdf.track_summary(kiev)
print("Summary for kiev.mid:")
print(kiev_s)

#Get the tempo map
kiev_tempo = mdf.tempo_df(kiev)
print("Tempo map (sample):")
print(kiev_tempo.head(10))

#Create the first midi DataFrame
kiev_df1 = mdf.midi_to_df(kiev,1,kiev_tempo)
print("Midi DataFrame for Track 1 (sample):")
print(kiev_df1.head(15))

#Condense the DataFrame
kiev_c1 = mdf.condense_df(kiev_df1)
print("Condensed DataFrame for Track 1 (sample)")
print(kiev_c1.head())

#Create and condense the DataFrame for Track 2 in one line
kiev_c2 = mdf.condense_df(mdf.midi_to_df(kiev,2,kiev_tempo))
print("Condensed DataFrame for Track 2 (sample)")
print(kiev_c2.head())

#Merge the DataFrames
kiev_m = mdf.merge_tracks([kiev_c1, kiev_c2],[1,2])
print("Merged DataFrame for Tracks 1 & 2 (sample)")
print(kiev_m.head())

#Calculate the maximum chord size
print("Maximum chord size:",mdf.max_notes(kiev_m))
print("Dyads in maximum chord:", mdf.max_dyads(kiev_m))

#Display the maximum count of each interval
print("Max ocurrences of each interval:")
print(mdf.max_dyad_counts(kiev_m))