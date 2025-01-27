import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_member_layout/reading-list/')({
  component: ReadingListIndex,
})

function ReadingListIndex() {
  return <div>Hello "/member/libraries/"!</div>
}
