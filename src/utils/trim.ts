function trim(string: string, chars?: string): string {
  if (chars === undefined) {
    return string.trim();
  }

  if (!string || !chars) {
    return string || '';
  }

  const str = ` ${string} `;
  const regFirst = new RegExp(` ${chars}`, 'gi');
  const regSecond = new RegExp(`${chars} `, 'gi');

  return str
    .replace(regFirst, '')
    .replace(regSecond, '')
    .trim();
}

export default trim;
