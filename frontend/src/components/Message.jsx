export const MessageType = Object.freeze({
  ERROR: 'error',
  SUCCESS: 'success'
})

export function Message({ content, messageType }) {
  if (content == null) { return }
  const color = {
    color: messageType === MessageType.ERROR ? 'red' : 'green'
  }
  return (
    <div className='message' style={color}>
      {content}
    </div>
  )
}
