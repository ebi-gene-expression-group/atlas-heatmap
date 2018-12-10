const trimEllipsify = (str, maxLength) => {
  if (str.length > maxLength) {
    const words = str.slice(0, maxLength).split(` `)
    if (words.length > 1) {
      return `${words.slice(0, -1).join(` `)} …`
    } else {
      return `${words[0].slice(0, -1)}…`
    }
  }

  return str
}

export default trimEllipsify
