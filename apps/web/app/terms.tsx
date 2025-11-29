import { MarkdownDocumentView } from '../components/ui/MarkdownDocumentView';

export default function TermsScreen() {
  return (
    <MarkdownDocumentView
      endpoint="terms"
      titleKey="legal.termsTitle"
      defaultTitle="Terms of Service"
      showOpenInNewTab={false}
    />
  );
}
