import React, { useState } from 'react';
import { Note } from '../../types';
import { dataService } from '../../services/dataService';
import {
  FileText,
  Plus,
  Search,
  Pin,
  Trash2,
  Edit,
  Sparkles,
  Tag,
  Check,
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const NotesView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Architecture');
  const [tagsInput, setTagsInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const notes = dataService.getNotes();

  const categories = ['All', ...Array.from(new Set(notes.map((n) => n.category)))];

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const handleOpenModal = (note?: Note) => {
    if (note) {
      setNoteToEdit(note);
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category);
      setTagsInput(note.tags.join(', '));
      setIsPinned(note.isPinned);
    } else {
      setNoteToEdit(null);
      setTitle('');
      setContent('');
      setCategory('Architecture');
      setTagsInput('research');
      setIsPinned(false);
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    // Auto-generate summary architecture preview
    const summary = content.slice(0, 120).replace(/[#*`]/g, '') + '...';

    if (noteToEdit) {
      dataService.updateNote(noteToEdit.id, {
        title,
        content,
        category,
        tags,
        isPinned,
        summary,
      });
    } else {
      dataService.addNote({
        title,
        content,
        category,
        tags,
        isPinned,
        summary,
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this note?')) {
      dataService.deleteNote(id);
    }
  };

  const handleTogglePin = (note: Note) => {
    dataService.updateNote(note.id, { isPinned: !note.isPinned });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/80 dark:border-neutral-800/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <span>Notes &amp; Research</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Structured knowledge base prepared for future AI summarization &amp; linking
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Note</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes by keyword or tag..."
            className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedNotes.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-xs text-neutral-400 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80">
            No notes found. Create your first note above.
          </div>
        ) : (
          sortedNotes.map((note) => (
            <div
              key={note.id}
              className="p-5 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800/80 space-y-3 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-[11px] text-neutral-400 font-medium">
                    {note.category}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTogglePin(note)}
                      className={`p-1 rounded transition-colors ${
                        note.isPinned
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-neutral-400 hover:text-neutral-600'
                      }`}
                      title={note.isPinned ? 'Unpin note' : 'Pin note'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenModal(note)}
                      className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="p-1 rounded text-neutral-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3
                  onClick={() => handleOpenModal(note)}
                  className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 cursor-pointer hover:underline"
                >
                  {note.title}
                </h3>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-4 leading-relaxed font-sans whitespace-pre-line">
                  {note.content}
                </p>
              </div>

              {/* AI Summarization Architecture Notice */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                {note.summary && (
                  <div className="p-2 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 text-[11px] text-neutral-600 dark:text-neutral-300 flex items-start gap-1.5">
                    <Sparkles className="w-3 h-3 text-blue-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{note.summary}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-neutral-400">
                  <div className="flex items-center gap-1 flex-wrap">
                    {note.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-neutral-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span>{note.updatedAt}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Note Edit / Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={noteToEdit ? 'Edit Note' : 'Create Note'}
        subtitle="Markdown formatted memo & research"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Scaled Dot-Product Attention Formulas"
              className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Content *
            </label>
            <textarea
              rows={8}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Draft your knowledge note..."
              className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Architecture, Machine Learning, Health"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="ai, deep-learning, papers"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pinNote"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="rounded accent-blue-600 cursor-pointer"
            />
            <label
              htmlFor="pinNote"
              className="text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer"
            >
              Pin this note to the top
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3.5 py-2 text-xs font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 transition-colors shadow-xs cursor-pointer"
            >
              Save Note
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
