export const c6Keys = [
  // White keys
  {
    key: 'a',
    notes: 'C6',
    type: 'white',
  },
  {
    key: 'w',
    notes: 'C#6',
    type: 'black',
  },
  {
    key: 's',
    notes: 'D6',
    type: 'white',
  },
  {
    key: 'e',
    notes: 'D#6',
    type: 'black',
  },
  {
    key: 'd',
    notes: 'E6',
    type: 'white',
  },
  {
    key: 'f',
    notes: 'F6',
    type: 'white',
  },
  {
    key: 't',
    notes: 'F#6',
    type: 'black',
  },
  {
    key: 'g',
    notes: 'G6',
    type: 'white',
  },
  {
    key: 'y',
    notes: 'G#6',
    type: 'black',
  },
  {
    key: 'h',
    notes: 'A6',
    type: 'white',
  },
  {
    key: 'u',
    notes: 'A#6',
    type: 'black',
  },
  {
    key: 'j',
    notes: 'B6',
    type: 'white',
  },
]

export const c5Keys = [
  // White keys
  {
    key: 'a',
    notes: 'C5',
    type: 'white',
  },
  {
    key: 'w',
    notes: 'C#5',
    type: 'black',
  },
  {
    key: 's',
    notes: 'D5',
    type: 'white',
  },
  {
    key: 'e',
    notes: 'D#5',
    type: 'black',
  },
  {
    key: 'd',
    notes: 'E5',
    type: 'white',
  },
  {
    key: 'f',
    notes: 'F5',
    type: 'white',
  },
  {
    key: 't',
    notes: 'F#5',
    type: 'black',
  },
  {
    key: 'g',
    notes: 'G5',
    type: 'white',
  },
  {
    key: 'y',
    notes: 'G#5',
    type: 'black',
  },
  {
    key: 'h',
    notes: 'A5',
    type: 'white',
  },
  {
    key: 'u',
    notes: 'A#5',
    type: 'black',
  },
  {
    key: 'j',
    notes: 'B5',
    type: 'white',
  },
]

export const c4keys = [
  // White keys
  {
    key: 'a',
    notes: 'C4',
    type: 'white',
  },
  {
    key: 'w',
    notes: 'C#4',
    type: 'black',
  },
  {
    key: 's',
    notes: 'D4',
    type: 'white',
  },
  {
    key: 'e',
    notes: 'D#4',
    type: 'black',
  },
  {
    key: 'd',
    notes: 'E4',
    type: 'white',
  },
  {
    key: 'f',
    notes: 'F4',
    type: 'white',
  },
  {
    key: 't',
    notes: 'F#4',
    type: 'black',
  },
  {
    key: 'g',
    notes: 'G4',
    type: 'white',
  },
  {
    key: 'y',
    notes: 'G#4',
    type: 'black',
  },
  {
    key: 'h',
    notes: 'A4',
    type: 'white',
  },
  {
    key: 'u',
    notes: 'A#4',
    type: 'black',
  },
  {
    key: 'j',
    notes: 'B4',
    type: 'white',
  },
]

export const keys = [...c4keys, ...c5Keys, ...c6Keys]

export type ItemKey = (typeof keys)[number]
