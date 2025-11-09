
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/en');
  return null;
}
