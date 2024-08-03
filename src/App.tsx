import { Midi, Track } from '@tonejs/midi'
import type { Note } from '@tonejs/midi/dist/Note'
import { Play, Trash2Icon, Pause, StepForward, Square } from 'lucide-solid'
import { animate } from 'motion'
import {
  createEffect,
  createResource,
  createSignal,
  For,
  onCleanup,
  Show,
} from 'solid-js'
import { getDraw, getTransport, loaded, now, Sequence, Time } from 'tone'
import { BlackKey } from '~/components/piano/black-key'
import { WhiteKey } from '~/components/piano/white-key'
import { Button } from '~/components/ui/button'
import * as FileUpload from '~/components/ui/file-upload'
import { IconButton } from '~/components/ui/icon-button'
import { Kbd } from '~/components/ui/kbd'
import { Slider } from '~/components/ui/slider'
import { cn } from '~/lib/cn'
import { type ItemKey, keys } from '~/lib/keys'
import { piano } from '~/lib/tone.fn'

/**
 * Convert a MIDI note into a pitch.
 */
function midiToPitch(midi: number): string {
  const octave = Math.floor(midi / 12) - 1
  return midiToPitchClass(midi) + octave.toString()
}

/**
 * Convert a MIDI note to a pitch class (just the pitch no octave).
 */
function midiToPitchClass(midi: number): string {
  const scaleIndexToNote = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
  ]
  const note = midi % 12
  return scaleIndexToNote[note]
}

// colors
const trackColors = [
  'bg-gradient-yellow-green',
  'bg-gradient-turquoise',
  'bg-gradient-pink',
  'bg-gradient-blue',
]

const countBlackAndWhiteKeys = (midi: number, minMidi: number) => {
  const blackKeys = [1, 3, 6, 8, 10] // MIDI numbers for C#, D#, F#, G#, A#
  let blackKeyCount = 0
  let whiteKeyCount = 0

  for (let i = minMidi; i < midi; i++) {
    if (blackKeys.includes(i % 12)) {
      blackKeyCount++
    } else {
      whiteKeyCount++
    }
  }

  return {
    blackKeyCount,
    whiteKeyCount,
  }
}

let lastTime = 0

const [currentMidi, setMidi] = createSignal<Midi | undefined>()

const [currentTime, setCurrentTime] = createSignal(0)
const [duration, setDuration] = createSignal(0)
const [volume, setVolume] = createSignal(0)

const [canvasWidth, setCanvasWidth] = createSignal(0)
const [canvasHeight, setCanvasHeight] = createSignal(0)

const [pianoWidth, setPianoWidth] = createSignal(0)
const [pianoHeight, setPianoHeight] = createSignal(0)

const [minMidi, setMinMidi] = createSignal<number | undefined>(undefined) // Default to A0
const [maxMidi, setMaxMidi] = createSignal(108) // Default to C8

piano.volume.value = volume()

const isSharpNote = (midi: number) => {
  const sharps = [1, 3, 6, 8, 10] // MIDI numbers for C#, D#, F#, G#, A#
  return sharps.includes(midi % 12)
}

function App() {
  let canvas: HTMLDivElement | undefined
  let pianoEl: HTMLDivElement | undefined

  const [toneResource] = createResource(loaded)

  const onPlay = (item: ItemKey) => {
    const keyEl = document.querySelector(`[data-key="${item.notes}"`)

    if (keyEl) {
      animate(
        (progress) => {
          if (progress === 1) {
            return keyEl.removeAttribute('data-state')
          }

          keyEl.setAttribute('data-state', 'active')
        },
        { duration: 0.5 }
      )
      piano.triggerAttackRelease(item.notes, 4)
    }
  }

  createEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      for (const item of keys) {
        if (event.key === item.key) {
          onPlay(item)
        }
      }
    }

    window.addEventListener('keydown', onKeydown)

    return () => {
      window.removeEventListener('keydown', onKeydown)
    }
  })

  // createEffect(() => {
  //   canvas()
  // })

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
  }

  const updateCanvasSize = () => {
    if (canvas) {
      setCanvasWidth(canvas.clientWidth)
      setCanvasHeight(canvas.clientHeight)
    }

    if (pianoEl) {
      setPianoWidth(pianoEl.clientWidth)
      setPianoHeight(pianoEl.clientHeight)
    }
  }

  createEffect(() => {
    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    onCleanup(() => window.removeEventListener('resize', updateCanvasSize))
  })

  const dynamicKeys = () => {
    const keys = []

    for (let i = minMidi() || 21; i <= maxMidi(); i++) {
      const note = midiToPitch(i)
      const key = note
      const type = note.includes('#') ? 'black' : 'white'

      keys.push({
        key,
        notes: note,
        type,
      })
    }

    return keys
  }

  const translateY = () => currentTime() * 500

  return (
    <div class=''>
      <div class=''>
        <span>{toneResource.loading && 'Loading...'}</span>

        <FileUpload.Root maxFiles={1}>
          <FileUpload.Dropzone>
            <FileUpload.Label>Drop your files here</FileUpload.Label>
            <FileUpload.Trigger
              asChild={(props) => (
                <Button size='sm' {...props}>
                  Open Dialog
                </Button>
              )}
            />
          </FileUpload.Dropzone>
          <FileUpload.ItemGroup>
            <FileUpload.Context>
              {(context) => (
                <For each={context().acceptedFiles}>
                  {(file) => {
                    const reader = new FileReader()
                    reader.onload = (e) => {
                      if (!e.target?.result) return
                      getTransport().cancel()

                      // piano.releaseAll()

                      const midi = new Midi(e.target.result as ArrayBuffer)
                      console.log(midi)

                      setMidi(midi)

                      const allNotes: Note[] = []
                      for (const track of midi.tracks) {
                        for (const note of track.notes) {
                          allNotes.push(note)
                        }
                      }

                      // Determine the min and max MIDI notes
                      const midiNumbers = allNotes.map((note) => note.midi)
                      setMinMidi(Math.min(...midiNumbers))
                      setMaxMidi(Math.max(...midiNumbers))

                      console.log({
                        minMidi: Math.min(...midiNumbers),
                        maxMidi: Math.max(...midiNumbers),
                      })

                      updateCanvasSize()

                      setDuration(midi.duration)

                      getTransport().PPQ = midi.header.ppq

                      getTransport().timeSignature =
                        midi.header.timeSignatures[0].timeSignature

                      let minOctave = Number.POSITIVE_INFINITY
                      let maxOctave = -1

                      getTransport().scheduleRepeat(() => {
                        const current = getTransport().seconds
                        setCurrentTime(current)

                        if (canvas) {
                          canvas.style.transform = `rotate(-180deg) scaleX(-1) translateY(${
                            current * -500
                          }px)`
                        }
                      }, 0.01667)

                      let trackNumber = 0
                      for (const track of midi.tracks) {
                        let noteNumber = 0

                        for (const note of track.notes) {
                          if (minOctave > note.octave) {
                            minOctave = note.octave
                          }

                          if (maxOctave < note.octave) {
                            maxOctave = note.octave
                          }

                          const trackColor =
                            trackColors[trackNumber % trackColors.length]

                          const startTime = Time(note.time).toSeconds()
                          const duration = Time(note.duration).toSeconds()

                          const isSharp = isSharpNote(note.midi)
                          // const seq = new Sequence((time, note) => {})
                          getTransport().schedule((time) => {
                            piano.triggerAttackRelease(
                              note.name,
                              duration,
                              time,
                              note.velocity
                            )

                            getDraw().schedule(() => {
                              //this callback is invoked from a requestAnimationFrame
                              //and will be invoked close to AudioContext time
                              const keyEl = document.querySelector(
                                `[data-key="${note.name}"`
                              ) as HTMLDivElement
                              if (keyEl) {
                                animate(
                                  (progress) => {
                                    if (progress === 1) {
                                      keyEl.classList.remove(trackColor)
                                      return

                                      // return keyEl.removeAttribute('data-state')
                                    }
                                    keyEl.classList.add(trackColor)
                                    // keyEl.setAttribute('data-state', 'active')
                                  },
                                  { duration: duration }
                                )
                              }

                              // const element = document.createElement('div')
                              // element.className = `${trackColor} absolute rounded-md${
                              //   isSharp ? ' brightness-50' : ''
                              // }`

                              // const whiteKeyWidth = 96 // There are 52 white keys on a standard piano
                              // const blackKeyWidth = 64

                              // const noteHeight = note.duration * 500

                              // const noteWidth = isSharp
                              //   ? blackKeyWidth
                              //   : whiteKeyWidth

                              // const keysCount = countBlackAndWhiteKeys(
                              //   note.midi,
                              //   minMidi()
                              // )

                              // const left =
                              //   keysCount.whiteKeyCount * whiteKeyWidth

                              // const noteLeft = isSharp
                              //   ? left - blackKeyWidth / 2
                              //   : left

                              // element.style.top = `${time * 500}px`
                              // element.style.left = `${noteLeft}px`
                              // element.style.width = `${noteWidth}px`
                              // element.style.height = `${noteHeight}px`

                              // canvas?.appendChild(element)

                              // animate(
                              //   element,
                              //   {
                              //     transform: [
                              //       'translateY(0px)',
                              //       `translateY(${canvasHeight()}px)`,
                              //     ],
                              //   },
                              //   {
                              //     duration: time + note.duration,
                              //     // duration: note.duration,
                              //     // delay: note.time - lastTime,
                              //     easing: 'linear',
                              //   }
                              // ).finished.then(() => {
                              //   element.remove()
                              // })

                              lastTime = time
                              // )
                            }, time)

                            // side effects
                            // piano.dispatchEvent(
                            //   new CustomEvent("highlight", { detail: { notes: [note.name] } })
                            // );
                            // canvas.dispatchEvent(
                            //   new CustomEvent("paint", { detail: { notes: [note.name] } })
                            // );
                          }, startTime)

                          noteNumber++
                        }

                        trackNumber++
                      }

                      getTransport().start(0)
                    }
                    reader.readAsArrayBuffer(file)
                    return (
                      <FileUpload.Item file={file}>
                        <FileUpload.ItemPreview type='image/*'>
                          <FileUpload.ItemPreviewImage />
                        </FileUpload.ItemPreview>
                        <FileUpload.ItemName />
                        <FileUpload.ItemSizeText />
                        <FileUpload.ItemDeleteTrigger
                          asChild={(props) => (
                            <IconButton variant='link' size='sm' {...props}>
                              <Trash2Icon />
                            </IconButton>
                          )}
                        />
                      </FileUpload.Item>
                    )
                  }}
                </For>
              )}
            </FileUpload.Context>
          </FileUpload.ItemGroup>
          <FileUpload.HiddenInput />
        </FileUpload.Root>

        <div class='flex flex-col gap-4'>
          <div class='flex gap-4'>
            <div class='w-full'>
              <Slider
                value={[currentTime()]}
                max={duration()}
                onValueChange={(newValue) => {
                  getTransport().seconds = newValue.value[0]
                  setCurrentTime(newValue.value[0])
                }}>
                <div>
                  {formatTime(currentTime())} / {formatTime(duration())}
                </div>
              </Slider>
            </div>

            <div class='w-40'>
              <Slider
                min={-60}
                max={0}
                step={1}
                value={[volume()]}
                onValueChange={(newValue) => {
                  setVolume(newValue.value[0])
                  if (piano) {
                    piano.volume.value = newValue.value[0]
                  }
                }}>
                Volume
              </Slider>
            </div>
          </div>

          <div class='flex gap-2'>
            <Button
              title='Play'
              onClick={() => {
                getTransport().start(0)
              }}>
              <Play />
            </Button>

            <Button
              title='Pause'
              onClick={() => {
                if (getTransport().state === 'started') {
                  getTransport().pause()
                }
                //dispose the synth and make a new one
                // piano.releaseAll()
                // piano.disconnect()
                // while (
                // ) {
                //   const synth = piano.shift()
                //   synth.disconnect()
                // }
              }}>
              <Pause />
            </Button>

            <Button
              title='Continue'
              onClick={async () => {
                // await start()
                // piano.sync()
                if (getTransport().state === 'paused') {
                  getTransport().start('+0.1')
                }
              }}>
              <StepForward />
            </Button>

            <Button
              title='Stop'
              onClick={async () => {
                // await start()
                // piano.sync()
                piano.releaseAll()
                getTransport().stop()
              }}>
              <Square />
            </Button>
          </div>

          <div class='flex flex-col'>
            <div class='flex justify-center overflow-hidden'>
              <div
                ref={canvas}
                style={{
                  width: `${pianoWidth()}px`,
                  // transform: `rotate(-180deg) scaleX(-1) translateY(${
                  //   currentTime() * -500
                  // }px)`,
                }}
                class='relative w-full h-full min-h-[1000px]'>
                <Show when={minMidi()}>
                  {(minMidi) => {
                    return (
                      <For each={currentMidi()?.tracks}>
                        {(track, i) => {
                          const octaves = track.notes.map((note) => note.octave)
                          const highestOctave = Math.max(...octaves)
                          const lowestOctave = Math.min(...octaves)

                          const trackColor =
                            trackColors[i() % trackColors.length]

                          return (
                            <For each={track.notes}>
                              {(note, j) => {
                                const isSharp = isSharpNote(note.midi)

                                const whiteKeyWidth = 96
                                const blackKeyWidth = 64

                                const noteHeight = note.duration * 500

                                const noteWidth = isSharp
                                  ? blackKeyWidth
                                  : whiteKeyWidth

                                const keysCount = countBlackAndWhiteKeys(
                                  note.midi,
                                  minMidi()
                                )

                                const left =
                                  keysCount.whiteKeyCount * whiteKeyWidth

                                const noteLeft = isSharp
                                  ? left - blackKeyWidth / 2
                                  : left

                                const elTop = `${note.time * 500}px`
                                const elLeft = `${noteLeft}px`
                                const elWidth = `${noteWidth}px`
                                const elHeight = `${noteHeight}px`

                                return (
                                  <div
                                    class={`absolute py-1.5 px-1 ${
                                      isSharp ? ' brightness-50' : ''
                                    }`}
                                    style={{
                                      top: elTop,
                                      left: elLeft,
                                      width: elWidth,
                                      height: elHeight,
                                    }}>
                                    <div
                                      class={`${trackColor} h-full w-full rounded-lg`}
                                    />
                                  </div>
                                )
                              }}
                            </For>
                          )
                        }}
                      </For>
                    )
                  }}
                </Show>
              </div>
            </div>
            <div class='flex justify-center'>
              <div ref={pianoEl} class='flex justify-center'>
                <For each={dynamicKeys()}>
                  {(item) =>
                    item.type === 'white' ? (
                      <WhiteKey
                        data-key={item.notes}
                        onClick={() => {
                          onPlay(item)
                        }}>
                        <Kbd>{item.key}</Kbd>
                      </WhiteKey>
                    ) : item.type === 'black' ? (
                      <BlackKey
                        data-key={item.notes}
                        onClick={() => {
                          onPlay(item)
                        }}>
                        <Kbd>{item.key}</Kbd>
                      </BlackKey>
                    ) : null
                  }
                </For>
              </div>
            </div>
          </div>
        </div>

        {/* <div class='relative'>
          <For each={currentMidi()?.tracks}>
            {(track) => {
              const octaves = track.notes.map((note) => note.octave)
              const highestOctave = Math.max(...octaves)
              const lowestOctave = Math.min(...octaves)

              console.log({ highestOctave, lowestOctave })

              return (
                <div class=''>
                  <For each={track.notes}>
                    {(note) => {
                      return (
                        <div class=''>
                          {note.name} {note.duration} {note.time} {note.bars}
                        </div>
                      )
                    }}
                  </For>
                </div>
              )
            }}
          </For>
        </div> */}

        {/* <Waterfall /> */}
      </div>
    </div>
  )
}

export default App
