import React, { useState } from 'react';
import { MessageSquare, Send, Edit2, CornerDownRight, Save, Trash, AlertTriangle, X, ArrowRight } from 'lucide-react';
import Avatar from './Avatar';

const CommentsSection = ({ 
  reviews = [], 
  currentUser, 
  onAddReview, 
  onEditReview, 
  onDeleteReview, 
  onReplyReview, 
  // Nuevos props para manejar acciones en respuestas
  onEditReply, 
  onDeleteReply 
}) => {
  // --- ESTADOS GLOBALES ---
  const [commentText, setCommentText] = useState("");

  // --- ESTADOS DE EDICIÓN, RESPUESTA Y BORRADO ---
  const [editingId, setEditingId] = useState(null); // ID del elemento (review o reply) que se edita
  const [editText, setEditText] = useState("");
  
  const [replyingToId, setReplyingToId] = useState(null); // ID del padre
  const [replyingToUser, setReplyingToUser] = useState(null); 
  const [replyText, setReplyText] = useState("");

  const [deletingId, setDeletingId] = useState(null); // ID del elemento a borrar

  // --- HANDLERS GENERALES ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (onAddReview) onAddReview({ text: commentText });
    setCommentText("");
  };

  // Prepara la edición (sirve para Review y Reply porque ambos tienen .id y .comentario)
  const startEditing = (item) => {
    setEditingId(item.id);
    setEditText(item.comentario);
    setReplyingToId(null);
    setDeletingId(null);
  };

  // --- LOGICA DE GUARDADO INTELIGENTE ---
  // Detectamos si es una Review principal o una Respuesta para llamar a la función correcta
  const saveEdit = (item, parentId = null) => {
    if (!editText.trim()) return;

    if (parentId) {
      // Es una respuesta
      if (onEditReply) onEditReply(parentId, item.id, editText);
    } else {
      // Es un comentario principal
      if (onEditReview) onEditReview(item.id, editText);
    }
    setEditingId(null);
    setEditText("");
  };

  const startReplying = (parentId, targetUser = null) => {
    setReplyingToId(parentId);
    setReplyingToUser(targetUser); 
    setReplyText("");
    setEditingId(null);
    setDeletingId(null);
  };

  const sendReply = (parentId) => {
    if (onReplyReview && replyText.trim()) {
      onReplyReview(parentId, replyText, replyingToUser); 
    }
    setReplyingToId(null);
    setReplyingToUser(null);
    setReplyText("");
  };

  const startDeleting = (id) => {
    setDeletingId(id);
    setEditingId(null); 
    setReplyingToId(null);
  };

  const confirmDelete = (itemId, parentId = null) => {
    if (parentId) {
        // Es una respuesta
        if (onDeleteReply) onDeleteReply(parentId, itemId);
    } else {
        // Es principal
        if (onDeleteReview) onDeleteReview(itemId);
    }
    setDeletingId(null);
  };

  return (
    <div className="animate-fadeIn space-y-8 max-w-5xl mx-auto">
      
      {/* INPUT PRINCIPAL (Igual que antes) */}
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
             <button onClick={handleSubmit} disabled={!commentText.trim() || !currentUser} className="absolute bottom-3 right-3 p-2 bg-red-600 text-white rounded-lg hover:bg-red-500 disabled:opacity-50 transition">
               <Send className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>

      {/* LISTA DE COMENTARIOS */}
      <div className="space-y-6">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => {
            const isMyComment = currentUser && review.userId === currentUser.uid;
            const isAdmin = currentUser?.role === 'admin';
            const canDelete = isAdmin || isMyComment;
            
            const reviewAuthor = { 
                displayName: isMyComment ? currentUser.displayName : review.usuario, 
                photoURL: isMyComment ? currentUser.photoURL : review.avatar, 
                avatarConfig: isMyComment ? currentUser.avatarConfig : review.avatarConfig 
            };

            return (
                <div key={review.id} className="bg-slate-800/30 p-5 rounded-xl border border-slate-700/30 hover:border-slate-600 transition group relative overflow-hidden">
                  
                  {/* --- COMENTARIO PRINCIPAL --- */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <Avatar user={reviewAuthor} size="md" />
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-200 text-sm md:text-base">{reviewAuthor.displayName}</h4>
                                {review.role === 'admin' && <span className="bg-red-600 text-[10px] px-1 rounded text-white">ADMIN</span>}
                            </div>
                            <span className="text-xs text-slate-500">{review.fecha}</span>
                        </div>
                    </div>
                    
                    {/* ACCIONES PRINCIPAL */}
                    {currentUser && (
                        <div className="h-8 flex items-center">
                            {deletingId === review.id ? (
                                <div className="flex items-center gap-2 bg-red-900/20 border border-red-500/30 rounded-lg px-2 py-1 animate-fadeIn">
                                    <span className="text-xs text-red-200 font-bold hidden sm:block">¿Borrar?</span>
                                    <button onClick={() => confirmDelete(review.id)} className="bg-red-600 text-white text-xs px-2 py-0.5 rounded font-bold">Si</button>
                                    <button onClick={() => setDeletingId(null)} className="bg-slate-700 text-white text-xs px-2 py-0.5 rounded">No</button>
                                </div>
                            ) : (
                                <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition">
                                    {isMyComment && (
                                        <button onClick={() => startEditing(review)} className="text-slate-500 hover:text-white p-1"><Edit2 className="w-4 h-4" /></button>
                                    )}
                                    <button onClick={() => startReplying(review.id)} className="text-slate-500 hover:text-blue-400 p-1"><CornerDownRight className="w-4 h-4" /></button>
                                    {canDelete && (
                                        <button onClick={() => startDeleting(review.id)} className="text-slate-500 hover:text-red-500 p-1"><Trash className="w-4 h-4" /></button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                  </div>

                  {/* TEXTO O EDITOR PRINCIPAL */}
                  {editingId === review.id ? (
                      <div className="mt-2 animate-fadeIn">
                          <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white focus:border-red-500 outline-none" />
                          <div className="flex gap-2 mt-2 justify-end">
                              <button onClick={() => setEditingId(null)} className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-white">Cancelar</button>
                              <button onClick={() => saveEdit(review)} className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded flex items-center gap-1"><Save className="w-3 h-3" /> Guardar</button>
                          </div>
                      </div>
                  ) : (
                      <p className={`text-slate-300 text-sm pl-12 ${deletingId === review.id ? 'opacity-30' : ''}`}>{review.comentario}</p>
                  )}

                  {/* CAJA DE RESPUESTA (Igual que antes) */}
                  {replyingToId === review.id && (
                      <div className="ml-14 mt-4 bg-slate-900/50 p-3 rounded-lg border border-slate-700 animate-fadeIn relative">
                          {/* ... contenido del input de respuesta ... */}
                          <div className="w-full">
                              {replyingToUser && (
                                  <div className="flex items-center gap-1 text-xs text-blue-400 mb-2 font-medium bg-blue-500/10 w-fit px-2 py-0.5 rounded">
                                      <ArrowRight className="w-3 h-3" /> Respondiendo a {replyingToUser}
                                      <button onClick={() => setReplyingToUser(null)} className="ml-1 hover:text-white"><X className="w-3 h-3"/></button>
                                  </div>
                              )}
                              <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Escribe tu respuesta..." className="w-full bg-transparent border-b border-slate-600 focus:border-blue-500 outline-none text-sm text-white min-h-[60px]" autoFocus />
                              <div className="flex justify-end gap-2 mt-2">
                                  <button onClick={() => setReplyingToId(null)} className="text-xs text-slate-400 hover:text-white">Cancelar</button>
                                  <button onClick={() => sendReply(review.id)} className="text-xs bg-blue-600 px-3 py-1 rounded text-white hover:bg-blue-500">Responder</button>
                              </div>
                          </div>
                      </div>
                  )}

                  {/* --- RESPUESTAS ANIDADAS --- */}
                  {review.replies && review.replies.length > 0 && (
                      <div className="ml-10 md:ml-14 mt-4 space-y-4 border-l-2 border-slate-700 pl-4">
                          {review.replies.map((reply, rIdx) => {
                               const isMyReply = currentUser && reply.userId === currentUser.uid;
                               const canDeleteReply = isAdmin || isMyReply;
                               const replyAuthor = {
                                  displayName: isMyReply ? currentUser.displayName : reply.usuario,
                                  photoURL: isMyReply ? currentUser.photoURL : reply.avatar,
                                  avatarConfig: isMyReply ? currentUser.avatarConfig : reply.avatarConfig
                               };

                              return (
                                  <div key={reply.id || rIdx} className="group/reply relative">
                                      <div className="flex items-center justify-between mb-1">
                                          <div className="flex items-center gap-2">
                                              <Avatar user={replyAuthor} size="sm" />
                                              <span className="font-bold text-slate-300 text-xs">{replyAuthor.displayName}</span>
                                              
                                              {/* TAG RESPUESTA */}
                                              {reply.replyToUser && (
                                                  <span className="text-[10px] text-slate-500 flex items-center gap-1 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                                                      <ArrowRight className="w-2 h-2" /> {reply.replyToUser}
                                                  </span>
                                              )}
                                              <span className="text-[10px] text-slate-600">{reply.fecha}</span>
                                          </div>

                                          {/* --- BOTONES DE LA RESPUESTA --- */}
                                          {currentUser && (
                                            <div className="flex items-center gap-2">
                                              {/* MODO BORRADO */}
                                              {deletingId === reply.id ? (
                                                <div className="flex items-center gap-1 bg-red-900/20 rounded px-1 animate-fadeIn">
                                                  <button onClick={() => confirmDelete(reply.id, review.id)} className="text-[10px] text-red-400 hover:text-white font-bold px-1">Borrar</button>
                                                  <button onClick={() => setDeletingId(null)} className="text-[10px] text-slate-400 hover:text-white px-1">X</button>
                                                </div>
                                              ) : (
                                                /* BOTONES NORMALES */
                                                <div className="flex items-center gap-1 opacity-0 group-hover/reply:opacity-100 transition">
                                                  {isMyReply && (
                                                    <button onClick={() => startEditing(reply)} className="text-slate-600 hover:text-white p-1" title="Editar"><Edit2 className="w-3 h-3" /></button>
                                                  )}
                                                  <button onClick={() => startReplying(review.id, replyAuthor.displayName)} className="text-slate-600 hover:text-blue-400 p-1" title="Responder"><CornerDownRight className="w-3 h-3" /></button>
                                                  {canDeleteReply && (
                                                    <button onClick={() => startDeleting(reply.id)} className="text-slate-600 hover:text-red-500 p-1" title="Eliminar"><Trash className="w-3 h-3" /></button>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          )}
                                      </div>

                                      {/* CONTENIDO O EDITOR DE RESPUESTA */}
                                      {editingId === reply.id ? (
                                        <div className="pl-8 mt-1 animate-fadeIn">
                                            <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full bg-slate-900 text-xs p-2 rounded border border-slate-600 text-white focus:border-blue-500 outline-none"/>
                                            <div className="flex justify-end gap-2 mt-1">
                                                <button onClick={() => setEditingId(null)} className="text-[10px] text-slate-400">Cancelar</button>
                                                <button onClick={() => saveEdit(reply, review.id)} className="text-[10px] bg-green-600 px-2 rounded text-white">Guardar</button>
                                            </div>
                                        </div>
                                      ) : (
                                        <p className={`text-slate-400 text-xs pl-8 ${deletingId === reply.id ? 'opacity-30' : ''}`}>{reply.comentario}</p>
                                      )}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;