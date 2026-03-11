import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://nolbcladiwwfaoxjjlmq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vbGJjbGFkaXd3ZmFveGpqbG1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODg0ODEsImV4cCI6MjA4ODY2NDQ4MX0.fjIqBUf30qZbNcBv8gCCwXA57Wf4kGqtygcUF919Gh8"
);

export function useIdeas() {
  const [ideas,     setIdeas]     = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("ideas")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setIdeas(data);
    setLoading(false);
  };

  const addIdea = async (draft) => {
    const { data, error } = await supabase
      .from("ideas")
      .insert([{ title: draft.title, description: draft.description, stage: draft.stage, comments: [], votes: [], analysis: null }])
      .select()
      .single();
    if (!error && data) {
      setIdeas((p) => [data, ...p]);
      return data;
    }
    return null;
  };

  const updateIdea = async (id, patch) => {
    setIdeas((p) => p.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    await supabase.from("ideas").update(patch).eq("id", id);
  };

  const deleteIdea = async (id) => {
    if (!window.confirm("¿Borrar esta idea?")) return false;
    await supabase.from("ideas").delete().eq("id", id);
    setIdeas((p) => p.filter((i) => i.id !== id));
    return true;
  };

  const addVote = async (id, vote) => {
    const idea = ideas.find((i) => i.id === id);
    if (!idea) return;
    await updateIdea(id, { votes: [...(idea.votes || []), vote] });
  };

  const addComment = async (id, comment) => {
    const idea = ideas.find((i) => i.id === id);
    if (!idea) return;
    await updateIdea(id, { comments: [...(idea.comments || []), comment] });
  };

  const saveAnalysis = async (id, analysis) => {
    setIdeas((p) => p.map((i) => (i.id === id ? { ...i, analysis } : i)));
    await supabase.from("ideas").update({ analysis }).eq("id", id);
  };

  return { ideas, loading, addIdea, updateIdea, deleteIdea, addVote, addComment, saveAnalysis };
}
