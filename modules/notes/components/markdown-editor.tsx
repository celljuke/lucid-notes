"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownEditorProps {
  title?: string;
  placeholder?: string;
  initialValue?: string;
  onChange?: (value: string) => void;
}

export function MarkdownEditor({
  title = "Description",
  placeholder = "Write your markdown here...",
  initialValue = "",
  onChange,
}: MarkdownEditorProps) {
  const [content, setContent] = React.useState(initialValue);

  // Track the last known initialValue to avoid unnecessary updates
  const lastInitialValueRef = React.useRef(initialValue);

  // Sync internal state with initialValue prop only when it actually changes
  React.useEffect(() => {
    if (initialValue !== lastInitialValueRef.current) {
      lastInitialValueRef.current = initialValue;
      setContent(initialValue);
    }
  }, [initialValue]);

  const handleContentChange = (value: string) => {
    setContent(value);
    onChange?.(value);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Header with title */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {title}
        </h2>
      </div>

      {/* Tabs Component */}
      <Tabs defaultValue="write" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="write" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Write
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="write" className="mt-4">
          <Card className="min-h-[200px] border border-gray-200 rounded-lg overflow-hidden p-0">
            <Textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder={placeholder}
              className="w-full h-[200px] p-4 border-0 resize-none focus:ring-0 focus:outline-none text-base leading-relaxed font-mono"
              style={{ minHeight: "200px" }}
            />
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <Card className="min-h-[200px] border border-gray-200 rounded-lg overflow-hidden py-0">
            <div className="p-4 h-[200px] overflow-y-auto">
              {content ? (
                <div className="prose prose-gray max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside mb-4 space-y-1">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside mb-4 space-y-1">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-gray-700 dark:text-gray-300">
                          {children}
                        </li>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 dark:text-gray-400 mb-4">
                          {children}
                        </blockquote>
                      ),
                      code: ({ children, className }) => {
                        const isInline = !className;
                        return isInline ? (
                          <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200">
                            {children}
                          </code>
                        ) : (
                          <code className="block bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm font-mono text-gray-800 dark:text-gray-200 overflow-x-auto">
                            {children}
                          </code>
                        );
                      },
                      strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900 dark:text-white">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic text-gray-700 dark:text-gray-300">
                          {children}
                        </em>
                      ),
                      a: ({ children, href }) => (
                        <a
                          href={href}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>Nothing to preview yet. Start writing in the Write tab!</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer with helpful tips */}
      <div className="text-sm text-gray-500">
        <p>
          Supports GitHub Flavored Markdown including tables, task lists, and
          syntax highlighting.{" "}
          <a
            href="https://guides.github.com/features/mastering-markdown/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Learn more about Markdown syntax
          </a>
        </p>
      </div>
    </div>
  );
}
