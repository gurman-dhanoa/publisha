'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';

// Icons for a professional look
import { 
  Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon, 
  AlignLeft, AlignCenter, AlignRight, List, ListOrdered, 
  Heading1, Heading2, Quote, Code, Minus, CheckSquare, Plus 
} from 'lucide-react';
import { Button, ButtonGroup, Tooltip } from '@heroui/react';

const TiptapEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openonPress: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder: 'Start typing your masterpiece...' }),
    ],
    immediatelyRender: false,
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-stone lg:prose-xl focus:outline-none max-w-none min-h-[500px] py-12',
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="relative">
      {/* 1. COMPREHENSIVE BUBBLE MENU (Appears on Selection) */}
      <BubbleMenu editor={editor} tippyoptions={{ duration: 150 }}>
        <div className="flex items-center bg-black/90 text-white p-1 rounded-xl shadow-2xl backdrop-blur-md">
          <ButtonGroup variant="light" size="sm">
            <Button isIconOnly onPress={() => editor.chain().focus().toggleBold().run()}>
              <Bold size={16} className={editor.isActive('bold') ? 'text-blue-400' : ''} />
            </Button>
            <Button isIconOnly onPress={() => editor.chain().focus().toggleItalic().run()}>
              <Italic size={16} className={editor.isActive('italic') ? 'text-blue-400' : ''} />
            </Button>
            <Button isIconOnly onPress={() => editor.chain().focus().toggleUnderline().run()}>
              <UnderlineIcon size={16} className={editor.isActive('underline') ? 'text-blue-400' : ''} />
            </Button>
            <Button isIconOnly onPress={setLink}>
              <LinkIcon size={16} className={editor.isActive('link') ? 'text-blue-400' : ''} />
            </Button>
          </ButtonGroup>

          <div className="w-[1px] h-4 bg-white/20 mx-1" />

          <ButtonGroup variant="light" size="sm">
            <Button isIconOnly onPress={() => editor.chain().focus().setTextAlign('left').run()}>
              <AlignLeft size={16} className={editor.isActive({ textAlign: 'left' }) ? 'text-blue-400' : ''} />
            </Button>
            <Button isIconOnly onPress={() => editor.chain().focus().setTextAlign('center').run()}>
              <AlignCenter size={16} className={editor.isActive({ textAlign: 'center' }) ? 'text-blue-400' : ''} />
            </Button>
          </ButtonGroup>
        </div>
      </BubbleMenu>

      {/* 2. ENHANCED FLOATING MENU (Appears on Empty Line) */}
      <FloatingMenu editor={editor}>
        <div className="flex items-start gap-2 group relative right-14">
          <button className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-400 transition-all">
            <Plus size={18} />
          </button>
          
          <div className="hidden group-hover:flex items-center gap-1 bg-white border-2 border-gray-300 shadow-sm rounded-2xl p-1 animate-in fade-in slide-in-from-left-4">
             <Button size="sm" variant="light" startContent={<Heading1 size={14}/>} onPress={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>Title</Button>
             <Button size="sm" variant="light" startContent={<Heading2 size={14}/>} onPress={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>Heading</Button>
             <Button size="sm" variant="light" startContent={<List size={14}/>} onPress={() => editor.chain().focus().toggleBulletList().run()}>List</Button>
             <Button size="sm" variant="light" startContent={<CheckSquare size={14}/>} onPress={() => editor.chain().focus().toggleTaskList().run()}>Tasks</Button>
             <Button size="sm" variant="light" startContent={<Quote size={14}/>} onPress={() => editor.chain().focus().toggleBlockquote().run()}>Quote</Button>
             <Button size="sm" variant="light" startContent={<Minus size={14}/>} onPress={() => editor.chain().focus().setHorizontalRule().run()}>Divider</Button>
          </div>
        </div>
      </FloatingMenu>

      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;