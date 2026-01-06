import React, { useState } from 'react';
import { MessageSquare, Send, Edit2, CornerDownRight, Save, Trash, AlertTriangle, X } from 'lucide-react';
import Avatar from './Avatar';

const CommentsSection = ({ reviews = [], currentUser, onAddReview, onEditReview, onReplyReview, onDeleteReview }) => {
  // --- ESTADOS GLOBALES ---
  const [commentText, setCommentText] = useState("");

  // --- ESTADOS DE EDICIÓN, RESPUESTA Y BORRADO ---
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState("");

  // NUEVO: Estado para saber qué comentario se está intentando borrar
  const [deletingId, setDeletingId] = useState(null);

  // --- HANDLER: NUEVO COMENTARIO ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (onAddReview) onAddReview({ text: commentText });
    setCommentText("");
  };

  // --- HANDLERS: EDICIÓN ---
  const startEditing = (review) => {
    setEditingId(review.id);
    setEditText(review.comentario);
    setReplyingToId(null);
    setDeletingId(null); // Reseteamos otros modos
  };

  const saveEdit = (reviewId) => {
    if (onEditReview && editText.trim()) {
      onEditReview(reviewId, editText);
    }
    setEditingId(null);
    setEditText("");
  };

  // --- HANDLERS: RESPUESTA ---
  const startReplying = (reviewId) => {
    setReplyingToId(reviewId);
    setReplyText("");
    setEditingId(null);
    setDeletingId(null); // Reseteamos otros modos
  };

  const sendReply = (reviewId) => {
    if (onReplyReview && replyText.trim()) {
      onReplyReview(reviewId, replyText);
    }
    setReplyingToId(null);
    setReplyText("");
  };

  // --- HANDLERS: BORRADO (NUEVO) ---
  const startDeleting = (reviewId) => {
    setDeletingId(reviewId);
    setEditingId(null); // Cerramos otros modos para evitar caos visual
    setReplyingToId(null);
  };

  const confirmDelete = (reviewId) => {
    if (onDeleteReview) onDeleteReview(reviewId);
    setDeletingId(null);
  };

  return (
    <div className="animate-fadeIn space-y-8 max-w-5xl mx-auto">
      
      {/* 1. INPUT PRINCIPAL */}
      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 shadow-xl">
        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-red-500" /> Deja tu opinión
        </h4>
        <div className="flex gap-4">
          <div className="shrink-0 hidden md:block">
             <Avatar user={currentUser} size="lg" className="shadow-lg" />
          </div>
          <div className="relative w-full">
             <textarea
               value={commentText}
               onChange={(e) => setCommentText(e.target.value)}
               placeholder={currentUser ? "¿Qué te pareció?" : "Inicia sesión para comentar..."}
               disabled={!currentUser}
               className="w-full bg-slate-900/50 text-white rounded-xl p-4 pr-12 outline-none border border-slate-700 focus:border-red-500/50 transition min-h-[100px] resize-none placeholder-slate-500"
             />
             <button 
               onClick={handleSubmit}
               disabled={!commentText.trim() || !currentUser}
               className="absolute bottom-3 right-3 p-2 bg-red-600 text-white rounded-lg hover:bg-red-500 disabled:opacity-50 transition"
             >
               <Send className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>

      {/* 2. LISTA DE COMENTARIOS */}
      <div className="space-y-6">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => {
            const isMyComment = currentUser && review.userId === currentUser.uid;
            const isAdmin = currentUser?.role === 'admin';
            const canDelete = isAdmin || isMyComment;
            
            // Lógica para mostrar siempre el avatar actualizado si soy yo
            const reviewAuthor = { 
                displayName: isMyComment ? currentUser.displayName : review.usuario, 
                photoURL: isMyComment ? currentUser.photoURL : review.avatar, 
                avatarConfig: isMyComment ? currentUser.avatarConfig : review.avatarConfig 
            };

            return (
                <div key={review.id} className="bg-slate-800/30 p-5 rounded-xl border border-slate-700/30 hover:border-slate-600 transition group relative overflow-hidden">
                  
                  {/* --- CABECERA DEL COMENTARIO --- */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <Avatar user={reviewAuthor} size="md" />
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-200 text-sm md:text-base">
                                    {reviewAuthor.displayName}
                                </h4>
                                {review.role === 'admin' && <span className="bg-red-600 text-[10px] px-1 rounded text-white">ADMIN</span>}
                            </div>
                            <span className="text-xs text-slate-500">{review.fecha}</span>
                        </div>
                    </div>
                    
                    {/* ZONA DE ACCIONES O CONFIRMACIÓN */}
                    {currentUser && (
                        <div className="h-8 flex items-center"> {/* Contenedor de altura fija para evitar saltos */}
                            
                            {/* CASO 1: SE ESTÁ CONFIRMANDO EL BORRADO */}
                            {deletingId === review.id ? (
                                <div className="flex items-center gap-2 bg-red-900/20 border border-red-500/30 rounded-lg px-2 py-1 animate-fadeIn">
                                    <AlertTriangle className="w-3 h-3 text-red-500" />
                                    <span className="text-xs text-red-200 font-bold hidden sm:block">¿Borrar?</span>
                                    
                                    {/* Botón Confirmar */}
                                    <button 
                                        onClick={() => confirmDelete(review.id)}
                                        className="bg-red-600 hover:bg-red-500 text-white text-xs px-2 py-0.5 rounded transition font-bold"
                                    >
                                        Si
                                    </button>
                                    
                                    {/* Botón Cancelar */}
                                    <button 
                                        onClick={() => setDeletingId(null)}
                                        className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-2 py-0.5 rounded transition"
                                    >
                                        No
                                    </button>
                                </div>
                            ) : (
                                /* CASO 2: BOTONES NORMALES (Editar, Responder, Borrar) */
                                <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition">
                                    {isMyComment && (
                                        <button onClick={() => startEditing(review)} className="text-slate-500 hover:text-white transition p-1" title="Editar">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button onClick={() => startReplying(review.id)} className="text-slate-500 hover:text-blue-400 transition p-1" title="Responder">
                                        <CornerDownRight className="w-4 h-4" />
                                    </button>
                                    {canDelete && (
                                        <button 
                                            onClick={() => startDeleting(review.id)} // <--- AHORA LLAMA A START DELETING
                                            className="text-slate-500 hover:text-red-500 transition p-1" 
                                            title="Eliminar"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                  </div>

                  {/* --- CONTENIDO O EDICIÓN --- */}
                  {editingId === review.id ? (
                      <div className="mt-2 animate-fadeIn">
                          <textarea 
                              value={editText} 
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white focus:border-red-500 outline-none"
                          />
                          <div className="flex gap-2 mt-2 justify-end">
                              <button onClick={() => setEditingId(null)} className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-white">Cancelar</button>
                              <button onClick={() => saveEdit(review.id)} className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-500 flex items-center gap-1">
                                  <Save className="w-3 h-3" /> Guardar
                              </button>
                          </div>
                      </div>
                  ) : (
                      <p className={`text-slate-300 text-sm leading-relaxed pl-12 opacity-90 transition-opacity ${deletingId === review.id ? 'opacity-30 blur-[1px]' : ''}`}>
                          {review.comentario}
                      </p>
                  )}

                  {/* --- CAJA DE RESPUESTA --- */}
                  {replyingToId === review.id && (
                      <div className="ml-14 mt-4 bg-slate-900/50 p-3 rounded-lg border border-slate-700 animate-fadeIn">
                          <div className="flex items-start gap-3">
                              <CornerDownRight className="w-5 h-5 text-slate-500 mt-2" />
                              <div className="w-full">
                                  <textarea 
                                      value={replyText} 
                                      onChange={(e) => setReplyText(e.target.value)}
                                      placeholder={`Respondiendo a ${review.usuario}...`}
                                      className="w-full bg-transparent border-b border-slate-600 focus:border-blue-500 outline-none text-sm text-white min-h-[60px]"
                                      autoFocus
                                  />
                                  <div className="flex justify-end gap-2 mt-2">
                                      <button onClick={() => setReplyingToId(null)} className="text-xs text-slate-400 hover:text-white">Cancelar</button>
                                      <button onClick={() => sendReply(review.id)} className="text-xs bg-blue-600 px-3 py-1 rounded text-white hover:bg-blue-500">Responder</button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}

                  {/* --- LISTA DE RESPUESTAS (ANIDADAS) --- */}
                  {review.replies && review.replies.length > 0 && (
                      <div className="ml-10 md:ml-14 mt-4 space-y-4 border-l-2 border-slate-700 pl-4">
                          {review.replies.map((reply, rIdx) => {
                               // Lógica Avatar Respuestas
                               const isMyReply = currentUser && reply.userId === currentUser.uid;
                               const replyAuthor = {
                                  displayName: isMyReply ? currentUser.displayName : reply.usuario,
                                  photoURL: isMyReply ? currentUser.photoURL : reply.avatar,
                                  avatarConfig: isMyReply ? currentUser.avatarConfig : reply.avatarConfig
                               };

                              return (
                                  <div key={rIdx} className="group/reply">
                                      <div className="flex items-center gap-2 mb-1">
                                          <Avatar user={replyAuthor} size="sm" />
                                          <span className="font-bold text-slate-300 text-xs">{replyAuthor.displayName}</span>
                                          <span className="text-[10px] text-slate-600">{reply.fecha}</span>
                                      </div>
                                      <p className="text-slate-400 text-xs pl-10">{reply.comentario}</p>
                                  </div>
                              );
                          })}
                      </div>
                  )}

                </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/50">
            <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm font-medium">Aún no hay reseñas.</p>
            <p className="text-xs opacity-60">¡Sé el primero en compartir tu opinión!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;