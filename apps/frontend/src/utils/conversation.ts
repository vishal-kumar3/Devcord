
export const showConversationName = (name: string | null, nameEdited: Date | null, username: string): string => {
  if (!name) return 'No name'
  if (nameEdited) return name
  const names = name.split(', ').filter((n) => n !== username)
  return names.join(', ')
}
