// app/prompts/components/prompts-grid.tsx
"use client";

// 导入 Action 和 UI 组件
import { createPrompt, updatePrompt, deletePrompt } from "@/actions/prompts-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Check, Copy, Edit2, Plus, Trash2 } from "lucide-react";
// 为提交事件处理程序导入 FormEvent 类型
import { useState, FormEvent } from "react";

// Prompt 接口 (保持不变)
interface Prompt { id: number; name: string; description: string; content: string; }
interface PromptsGridProps { initialPrompts: Prompt[]; }

export const PromptsGrid = ({ initialPrompts }: PromptsGridProps) => {
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);
  const [copiedId, setCopiedId] = useState<number | null>(null); // 用于稍后的复制功能

  // --- 创建/编辑表单的状态 ---
  const [isFormOpen, setIsFormOpen] = useState(false); // 对话框可见性
  const [formData, setFormData] = useState({ name: "", description: "", content: "" }); // 表单字段值
  const [isSubmitting, setIsSubmitting] = useState(false); // 提交期间的加载状态
  const [error, setError] = useState<string | null>(null); // 错误信息状态
  const [editingId, setEditingId] = useState<number | null>(null); // 编辑时为 id，创建时为 null
  // --- 状态结束 ---

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // --- 事件处理程序 ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // 当输入值改变时更新 formData 状态
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditClick = (promptToEdit: Prompt) => {
    setEditingId(promptToEdit.id);
    setFormData({
      name: promptToEdit.name,
      description: promptToEdit.description,
      content: promptToEdit.content,
    });
    setError(null);
    setIsFormOpen(true);
  };

  const resetAndCloseForm = () => {
    setIsFormOpen(false);
    setFormData({ name: "", description: "", content: "" });
    setError(null);
    setIsSubmitting(false);
    setEditingId(null);
  };

  const handleOpenDeleteDialog = (id: number) => {
    setDeletingId(id);
    setDeleteError(null);
  };
  const handleCloseDeleteDialog = () => {
    if (!isDeleting) {
      setDeletingId(null);
      setDeleteError(null);
    }
  };
  const handleDeleteConfirm = async () => {
    if (deletingId === null) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deletePrompt(deletingId);
      setPrompts((prevPrompts) => prevPrompts.filter((p) => p.id !== deletingId));
      setDeletingId(null);
      setIsDeleting(false);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "删除提示失败。");
      setIsDeleting(false);
    }
  };

  // 处理创建提示的表单提交
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 阻止标准的表单提交/页面重载
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingId !== null) {
        // 编辑模式
        const updatedPrompt = await updatePrompt({ id: editingId, ...formData });
        setPrompts((prevPrompts) =>
          prevPrompts.map((p) => (p.id === editingId ? updatedPrompt : p))
        );
      } else {
        // 创建模式
        const newPrompt = await createPrompt(formData);
        setPrompts((prevPrompts) => [newPrompt, ...prevPrompts]);
      }
      resetAndCloseForm(); // 成功后关闭对话框并重置表单
    } catch (err) {
      // 处理来自服务器操作的错误
      console.error("创建提示错误:", err);
      setError(err instanceof Error ? err.message : "保存提示失败。");
      setIsSubmitting(false); // 重要：在出错时重置加载状态
    }
  };
  // --- 处理程序结束 ---

   // --- 渲染逻辑 ---
  // (保持 'prompts.length === 0' 的代码块不变)
   if (prompts.length === 0) { /* ... */ }

  return (
    <>
      {/* 创建按钮和对话框设置 */}
      <div className="mb-6 flex justify-end">
        <Dialog open={isFormOpen} onOpenChange={(open) => { if (!open) resetAndCloseForm(); else setIsFormOpen(open); }}>
          <DialogTrigger asChild>
            {/* 这个按钮现在会打开对话框 */}
            <Button onClick={() => { setEditingId(null); resetAndCloseForm(); setIsFormOpen(true); }} className="gap-2">
              <Plus className="w-5 h-5" /> {editingId ? '保存更改' : '创建提示'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] md:max-w-[600px]" onInteractOutside={(e) => { if(isSubmitting) e.preventDefault(); }}>
            <DialogHeader>
              <DialogTitle>{editingId ? '编辑提示' : '创建新提示'}</DialogTitle>
              <DialogDescription>
                {editingId ? '对你现有的提示进行更改。' : '为你的新提示输入详情。'}
              </DialogDescription>
            </DialogHeader>
            {/* 表单组件 */}
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              {/* 名称 */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">名称</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required className="col-span-3" disabled={isSubmitting} />
              </div>
              {/* 描述 */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">描述</Label>
                <Input id="description" name="description" value={formData.description} onChange={handleInputChange} required className="col-span-3" disabled={isSubmitting} />
              </div>
              {/* 内容 */}
              <div className="grid grid-cols-4 items-start gap-4"> {/* 使用 items-start 以对齐 textarea */}
                <Label htmlFor="content" className="text-right pt-2">内容</Label> {/* 为标签添加上内边距 */}
                <Textarea id="content" name="content" value={formData.content} onChange={handleInputChange} required className="col-span-3 min-h-[120px]" disabled={isSubmitting} />
              </div>
              {/* 错误显示 */}
              {error && <p className="col-span-4 text-center text-sm text-red-500 px-6">{error}</p>}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetAndCloseForm} disabled={isSubmitting}>取消</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (editingId ? '正在保存...' : '正在创建...') : (editingId ? '保存更改' : '创建提示')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 提示网格显示 (保持不变) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map((prompt, index) => (
           <motion.div key={prompt.id} /* ... */ >
             <Card className="h-full flex flex-col ...">
                {/* ... 卡片内容 ... */}
                 {/* 确保按钮目前只在控制台打印日志 */}
                 <div className="flex gap-1">
                   <Button variant="ghost" size="icon" className="h-7 w-7" title="编辑" onClick={() => handleEditClick(prompt)}> <Edit2 className="w-4 h-4" /> </Button>
                   <Button
                     variant="ghost"
                     size="icon"
                     className="h-7 w-7 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500"
                     title="删除"
                     onClick={() => handleOpenDeleteDialog(prompt.id)}
                   >
                     <Trash2 className="w-4 h-4" />
                   </Button>
                   <Button variant="ghost" size="icon" className="h-7 w-7" title="复制" onClick={() => console.log('Copy', prompt.id)}> <Copy className="w-4 h-4" /> </Button>
                 </div>
                {/* ... */}
             </Card>
           </motion.div>
        ))}
      </div>

      <Dialog open={deletingId !== null} onOpenChange={(open) => { if(!open) handleCloseDeleteDialog(); }}>
        <DialogContent onInteractOutside={(e) => { if(isDeleting) e.preventDefault(); }}>
          <DialogHeader>
            <DialogTitle>你确定要这样做吗？</DialogTitle>
            <DialogDescription>
              此操作无法撤销。这将永久删除该提示：<br />
              <strong className="break-words">{prompts.find(p => p.id === deletingId)?.name ?? '此提示'}</strong>
            </DialogDescription>
          </DialogHeader>
          {deleteError && (
            <p className="text-sm text-red-600 dark:text-red-400 text-center py-2">{deleteError}</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDeleteDialog} disabled={isDeleting}>取消</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? "正在删除..." : "是的，删除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};