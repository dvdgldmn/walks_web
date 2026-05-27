import { PageEditor } from '../page-editor';

type PageEditorRouteProps = {
  params: Promise<{
    type: string;
  }>;
};

export default async function SinglePageEditorRoute({ params }: PageEditorRouteProps) {
  const { type } = await params;
  return <PageEditor type={type} />;
}
