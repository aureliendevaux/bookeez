import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_member_layout/account/')({
  component: Account,
})

function Account() {
  return <div>Hello "/account/"!</div>
}
