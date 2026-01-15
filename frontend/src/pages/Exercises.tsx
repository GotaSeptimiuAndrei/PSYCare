import { useState } from "react";
import NavigationBar from "../components/NavigationBar";
import { useGetAllExercises, useCreateExercise, useUpdateExercise, useDeleteExercise } from "../hooks/useExercise";
import type { Exercise } from "../types/exercise";

export default function Exercises() {
  const { data: exercises, isLoading, isError } = useGetAllExercises();
  const createMutation = useCreateExercise();
  const updateMutation = useUpdateExercise();
  const deleteMutation = useDeleteExercise();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const exerciseData: Exercise = { title, description, contentUrl: videoUrl };

    if (editingId) {
      updateMutation.mutate(
        { id: editingId, exercise: exerciseData },
        { onSuccess: resetForm }
      );
    } else {
      createMutation.mutate(exerciseData, { onSuccess: resetForm });
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setVideoUrl("");
    setEditingId(null);
  };

  const handleEdit = (ex: Exercise) => {
    setEditingId(ex.id!);
    setTitle(ex.title);
    setDescription(ex.description);
    setVideoUrl(ex.contentUrl);
  };

  if (isLoading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;
  if (isError) return <div style={{ padding: "40px", color: "red" }}>Error loading exercises.</div>;

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <NavigationBar />

      <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
        <h1 style={{ color: "#2c3e50", marginBottom: "30px", fontWeight: "600" }}>Exercise Management</h1>

        <div style={{ background: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", marginBottom: "40px" }}>
          <h3 style={{ marginTop: 0, color: "#34495e" }}>{editingId ? "Edit Exercise" : "Create New Exercise"}</h3>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ padding: "12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "16px" }}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{ padding: "12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "16px", minHeight: "100px", resize: "vertical" }}
            />
            <input
              placeholder="Video or Content URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              style={{ padding: "12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "16px" }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                style={{ backgroundColor: editingId ? "#3498db" : "#27ae60", color: "white", padding: "12px 24px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", transition: "opacity 0.2s" }}
              >
                {editingId ? "Update Exercise" : "Save Exercise"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{ backgroundColor: "#95a5a6", color: "white", padding: "12px 24px", border: "none", borderRadius: "6px", cursor: "pointer" }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <h3 style={{ color: "#34495e", marginBottom: "20px" }}>Available Exercises</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {exercises?.map((ex) => (
            <div key={ex.id} style={{ border: 'none', padding: '20px', borderRadius: '12px', background: 'white', boxShadow: "0 2px 8px rgba(0,0,0,0.08)", transition: "transform 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h4 style={{ margin: '0 0 10px 0', color: "#2c3e50", fontSize: "20px" }}>{ex.title}</h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEdit(ex)} style={{ background: '#ecf0f1', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', color: "#2980b9" }}>Edit</button>
                  <button onClick={() => ex.id && deleteMutation.mutate(ex.id)} style={{ background: '#fdedec', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', color: "#e74c3c" }}>Delete</button>
                </div>
              </div>
              <p style={{ color: "#7f8c8d", lineHeight: "1.6", margin: "10px 0" }}>{ex.description}</p>

              {ex.contentUrl && ex.contentUrl.trim() !== "" && (
                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: "1px solid #eee" }}>
                  <a
                    href={ex.contentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#3498db', textDecoration: 'none', fontWeight: '500', display: "inline-flex", alignItems: "center", gap: "5px" }}
                  >
                    View Resources
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
