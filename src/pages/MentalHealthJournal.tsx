import { useState, useEffect } from 'react';
import { useHealthData, JournalEntry } from '../context/HealthDataContext';
import Card from '../components/common/Card';
import { BookHeart, Edit, Calendar, Plus, Hash, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, subDays } from 'date-fns';
import BarChart from '../components/charts/BarChart';

const MentalHealthJournal = () => {
  const { journalEntries, addJournalEntry } = useHealthData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
    date: new Date().toISOString().split('T')[0],
    text: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // All unique tags across all journal entries
  const [allTags, setAllTags] = useState<string[]>([]);
  
  useEffect(() => {
    // Extract all unique tags from journal entries
    const tags = Array.from(new Set(journalEntries.flatMap(entry => entry.tags)));
    setAllTags(tags);
  }, [journalEntries]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEntry.date || !newEntry.text || newEntry.tags?.length === 0) return;
    
    const journalEntry: JournalEntry = {
      date: newEntry.date,
      text: newEntry.text || '',
      tags: newEntry.tags || []
    };
    
    addJournalEntry(journalEntry);
    setShowAddForm(false);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      text: '',
      tags: []
    });
    setTagInput('');
  };
  
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    const newTag = tagInput.trim().toLowerCase();
    if (!newEntry.tags?.includes(newTag)) {
      setNewEntry({
        ...newEntry,
        tags: [...(newEntry.tags || []), newTag]
      });
    }
    setTagInput('');
  };
  
  const handleRemoveTag = (tag: string) => {
    setNewEntry({
      ...newEntry,
      tags: newEntry.tags?.filter(t => t !== tag) || []
    });
  };
  
  const toggleTagFilter = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  // Filter entries based on search term and selected tags
  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch = !searchTerm || 
      entry.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => entry.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });
  
  // Prepare data for the mood chart
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = journalEntries.filter(entry => entry.tags.includes(tag)).length;
    return acc;
  }, {} as Record<string, number>);
  
  // Sort tags by frequency for the chart
  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7);
  
  const chartData = {
    labels: sortedTags.map(([tag]) => tag),
    datasets: [
      {
        label: 'Frequency',
        data: sortedTags.map(([_, count]) => count),
        backgroundColor: [
          'rgba(124, 58, 237, 0.7)',
          'rgba(79, 70, 229, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(236, 72, 153, 0.7)',
        ],
      }
    ],
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6">
        <motion.h1 
          className="text-3xl font-bold text-white mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Mental Health Journal
        </motion.h1>
        <motion.p 
          className="text-secondary text-lg font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Track your thoughts, feelings, and emotional well-being
        </motion.p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Journal Controls */}
        <div className="md:col-span-4 space-y-6">
          <Card variant="glass">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <BookHeart size={20} className="text-primary-400 mr-2" />
                <h3 className="font-medium text-white">Journal Stats</h3>
              </div>
              <button
                className="btn btn-primary text-sm px-3 py-1 flex items-center gap-1"
                onClick={() => setShowAddForm(true)}
              >
                <Plus size={14} />
                <span>New Entry</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-surface-dark-300 p-3 rounded-lg">
                <div className="text-sm text-primary-300 mb-1">Total Entries</div>
                <div className="text-2xl font-bold text-white">{journalEntries.length}</div>
              </div>
              
              <div className="bg-surface-dark-300 p-3 rounded-lg">
                <div className="text-sm text-secondary mb-1">Last Entry</div>
                <div className="font-medium text-secondary">
                  {journalEntries.length > 0
                    ? format(parseISO(journalEntries[0].date), 'MMMM d, yyyy')
                    : 'No entries yet'}
                </div>
              </div>
              
              <div className="bg-surface-dark-300 p-3 rounded-lg">
                <div className="text-sm text-secondary mb-1">Most Used Tags</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {sortedTags.slice(0, 5).map(([tag, count]) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center rounded-full bg-primary-400/20 px-2 py-1 text-xs font-medium text-primary-300"
                    >
                      {tag} ({count})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          
          {/* Mood Chart */}
          <Card title="Mood Tags" subtitle="Frequency analysis" variant="glass">
            {allTags.length > 0 ? (
              <BarChart data={chartData} height={200} />
            ) : (
              <div className="py-10 text-center text-secondary">
                Add journal entries with tags to see your mood patterns
              </div>
            )}
          </Card>
        </div>
        
        {/* Journal Entries */}
        <div className="md:col-span-8">
          <Card>
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  className="input pl-10"
                  placeholder="Search journal entries or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              
              {allTags.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center text-sm text-slate-600 mb-2">
                    <Hash size={16} className="mr-1" />
                    <span>Filter by tags:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-purple-500 text-white'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        }`}
                        onClick={() => toggleTagFilter(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {filteredEntries.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-lg text-slate-500">No journal entries yet</p>
                <p className="text-sm text-slate-400 mt-2">Start journaling to track your mental well-being</p>
                <button
                  className="btn btn-primary mt-4"
                  onClick={() => setShowAddForm(true)}
                >
                  Write First Entry
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEntries.map((entry, index) => (
                  <motion.div
                    key={`${entry.date}-${index}`}
                    className="p-4 bg-surface-dark-300 rounded-lg border border-white/10 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center text-secondary text-sm">
                        <Calendar size={14} className="mr-1" />
                        {format(parseISO(entry.date), 'EEEE, MMMM d, yyyy')}
                      </div>
                      <button className="text-secondary hover:text-primary-400">
                        <Edit size={14} />
                      </button>
                    </div>
                    <p className="text-white mb-3">{entry.text}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-primary-400/20 px-2.5 py-0.5 text-xs font-medium text-primary-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {/* Add Journal Entry Form */}
      <AnimatePresence>
        {showAddForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowAddForm(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-0 bottom-0 bg-white rounded-t-xl z-50 p-6 max-w-2xl mx-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-slate-800">New Journal Entry</h3>
                <button
                  className="text-slate-500 hover:text-slate-700"
                  onClick={() => setShowAddForm(false)}
                >
                  &times;
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    className="input"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="journalText" className="block text-sm font-medium text-slate-700 mb-1">
                    Journal Entry
                  </label>
                  <textarea
                    id="journalText"
                    className="input h-32 resize-none"
                    placeholder="Write about your thoughts, feelings, and experiences..."
                    value={newEntry.text}
                    onChange={(e) => setNewEntry({ ...newEntry, text: e.target.value })}
                    required
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tags
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      className="input flex-1"
                      placeholder="Add tags (e.g., happy, anxious, productive)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary ml-2"
                      onClick={handleAddTag}
                    >
                      Add
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newEntry.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700"
                      >
                        {tag}
                        <button
                          type="button"
                          className="ml-1 text-purple-500 hover:text-purple-700"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  {allTags.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs text-slate-500 mb-1">Frequently used tags:</div>
                      <div className="flex flex-wrap gap-1">
                        {sortedTags.slice(0, 8).map(([tag]) => (
                          <button
                            key={tag}
                            type="button"
                            className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
                            onClick={() => {
                              if (!newEntry.tags?.includes(tag)) {
                                setNewEntry({
                                  ...newEntry,
                                  tags: [...(newEntry.tags || []), tag]
                                });
                              }
                            }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={!newEntry.text || !newEntry.tags?.length}
                  >
                    Save Journal Entry
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MentalHealthJournal;