import router from '../router';

export function handleLinkClick(event: MouseEvent): void {
  event.preventDefault();
  const target = event.target as HTMLElement;
  const link = target.closest('a');

  if (link) {
    const href = link.getAttribute('href');
    if (href) {
      router.go(href);
    }
  }
}
