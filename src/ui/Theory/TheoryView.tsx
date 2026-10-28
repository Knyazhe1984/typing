import { useMemo } from 'react'
import type { Lesson, TheoryPage } from '../../core/course/types'
import { layouts, strokeFor, type Finger } from '../../core/layouts'
import { HandsView } from '../HandsView/HandsView'
import { KeyboardView } from '../KeyboardView/KeyboardView'
import { useL10n } from '../useL10n'
import { PostureView } from './PostureView'

const homeCodes = new Set(['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'])
const shiftCodes = new Set(['ShiftLeft', 'ShiftRight'])
const homeFingers: Finger[] = ['L5', 'L4', 'L3', 'L2', 'R2', 'R3', 'R4', 'R5']

function Illustration({ page, lesson }: { page: TheoryPage; lesson: Lesson }) {
  const layout = layouts[lesson.layout]
  const newKeys = useMemo(() => {
    const strokes = [...(lesson.newKeys ?? '')]
      .map((ch) => strokeFor(layout, ch))
      .filter((x) => !!x)
    // Для символов с Shift подсвечиваем и Shift, и мизинец, который его жмёт
    const shiftFinger = (code: string): Finger => (code === 'ShiftLeft' ? 'L5' : 'R5')
    return {
      codes: new Set(
        strokes.flatMap((st) => [st.key.code, ...(st.shiftCode ? [st.shiftCode] : [])]),
      ),
      fingers: strokes.flatMap((st) => [
        st.key.finger,
        ...(st.shiftCode ? [shiftFinger(st.shiftCode)] : []),
      ]),
    }
  }, [lesson, layout])

  switch (page.illustration?.type) {
    case 'posture':
      return <PostureView />
    case 'homeRow':
      return (
        <>
          <HandsView active={homeFingers} />
          <KeyboardView layout={layout} highlightCodes={homeCodes} />
        </>
      )
    case 'fingers':
      return (
        <>
          <HandsView active={[]} />
          <KeyboardView layout={layout} />
        </>
      )
    case 'newKeys':
      return (
        <>
          <HandsView active={newKeys.fingers} />
          <KeyboardView
            layout={layout}
            highlightCodes={newKeys.codes}
            enabledChars={new Set(lesson.keys)}
          />
        </>
      )
    case 'shift':
      return (
        <>
          <HandsView active={['L5', 'R5']} />
          <KeyboardView layout={layout} highlightCodes={shiftCodes} />
        </>
      )
    default:
      return null
  }
}

/** Абзацы и списки: строки с «- » в начале собираются в список. */
function Body({ text }: { text: string }) {
  const blocks: (string | string[])[] = []
  for (const line of text.split('\n')) {
    if (line.startsWith('- ')) {
      const last = blocks.at(-1)
      if (Array.isArray(last)) last.push(line.slice(2))
      else blocks.push([line.slice(2)])
    } else if (line.trim()) blocks.push(line)
  }
  return (
    <>
      {blocks.map((b, i) =>
        Array.isArray(b) ? (
          <ul key={i}>
            {b.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        ) : (
          <p key={i}>{b}</p>
        ),
      )}
    </>
  )
}

export function TheoryView({ page, lesson }: { page: TheoryPage; lesson: Lesson }) {
  const l = useL10n()
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2 style={{ margin: 0 }}>{l(page.title)}</h2>
      <div style={{ fontSize: 17, maxWidth: 720 }}>
        <Body text={l(page.body)} />
      </div>
      <Illustration page={page} lesson={lesson} />
    </div>
  )
}
