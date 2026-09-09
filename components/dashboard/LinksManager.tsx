'use client';
import { useState } from 'react';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Check,
  GripVertical,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { normalizeSocialUrl, platformLabels } from '@/lib/qard/social';
import { SocialIcon } from '@/components/qard/SocialIcon';
import { socialLinkSchema } from '@/lib/qard/validation';
import type { Profile, SocialLink } from '@/types/database';

const platforms = Object.keys(platformLabels);
function SortableLink({
  link,
  onDelete,
  onToggle,
  onEdit,
}: {
  link: SocialLink;
  onDelete: (id: string) => void;
  onToggle: (link: SocialLink) => void;
  onEdit: (link: SocialLink) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: link.id });
  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="sortable-link"
    >
      <button
        className="drag-handle"
        {...attributes}
        {...listeners}
        aria-label="Déplacer"
      >
        <GripVertical size={18} />
      </button>
      <span className="link-platform">
        <SocialIcon platform={link.platform} />
      </span>
      <div>
        <strong>{link.label || platformLabels[link.platform]}</strong>
        <small>{link.username || link.url}</small>
      </div>
      <label className="mini-switch">
        <input
          aria-label={`${link.enabled ? 'Masquer' : 'Afficher'} ${link.label || platformLabels[link.platform]}`}
          type="checkbox"
          checked={link.enabled}
          onChange={() => onToggle(link)}
        />
        <i />
      </label>
      <button
        className="edit-link"
        onClick={() => onEdit(link)}
        aria-label="Modifier"
      >
        <Pencil size={16} />
      </button>
      <button
        className="icon-danger"
        onClick={() => onDelete(link.id)}
        aria-label="Supprimer"
      >
        <Trash2 size={17} />
      </button>
    </article>
  );
}
export function LinksManager({
  profile,
  initialLinks,
}: {
  profile: Profile;
  initialLinks: SocialLink[];
}) {
  const [links, setLinks] = useState(initialLinks);
  const [platform, setPlatform] = useState('instagram');
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const flash = (text: string) => {
    setToast(text);
    setTimeout(() => setToast(''), 1800);
  };
  async function saveLink() {
    if (!value.trim()) return;
    setBusy(true);
    const payload = {
      profile_id: profile.id,
      platform,
      label: label.trim() || null,
      url: normalizeSocialUrl(platform, value),
      username: value.replace(/^@/, ''),
      position: editingId
        ? (links.find((item) => item.id === editingId)?.position ??
          links.length)
        : links.length,
      enabled: true,
    };
    const parsed = socialLinkSchema.safeParse(payload);
    if (!parsed.success) {
      flash(parsed.error.issues[0]?.message ?? 'Lien invalide');
      setBusy(false);
      return;
    }
    const query = editingId
      ? createClient()
          .from('qard_social_links')
          .update(parsed.data)
          .eq('id', editingId)
      : createClient()
          .from('qard_social_links')
          .insert({
            ...parsed.data,
            profile_id: profile.id,
            position: payload.position,
          });
    const { data, error } = await query.select().single();
    if (!error && data) {
      setLinks(
        editingId
          ? links.map((item) =>
              item.id === editingId ? (data as SocialLink) : item,
            )
          : [...links, data as SocialLink],
      );
      setValue('');
      setLabel('');
      setEditingId(null);
      flash(editingId ? 'Lien modifié' : 'Lien ajouté');
    } else flash(error?.message ?? 'Erreur');
    setBusy(false);
  }
  function edit(link: SocialLink) {
    setEditingId(link.id);
    setPlatform(link.platform);
    setLabel(link.label ?? '');
    setValue(link.username || link.url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  async function remove(id: string) {
    const { error } = await createClient()
      .from('qard_social_links')
      .delete()
      .eq('id', id);
    if (!error) {
      setLinks(links.filter((item) => item.id !== id));
      flash('Lien supprimé');
    }
  }
  async function toggle(link: SocialLink) {
    const enabled = !link.enabled;
    const { error } = await createClient()
      .from('qard_social_links')
      .update({ enabled })
      .eq('id', link.id);
    if (!error)
      setLinks(
        links.map((item) =>
          item.id === link.id ? { ...item, enabled } : item,
        ),
      );
  }
  async function dragEnd(event: DragEndEvent) {
    if (!event.over || event.active.id === event.over.id) return;
    const from = links.findIndex((item) => item.id === event.active.id);
    const to = links.findIndex((item) => item.id === event.over?.id);
    const reordered = arrayMove(links, from, to).map((item, position) => ({
      ...item,
      position,
    }));
    setLinks(reordered);
    const supabase = createClient();
    const results = await Promise.all(
      reordered.map((item) =>
        supabase
          .from('qard_social_links')
          .update({ position: item.position })
          .eq('id', item.id),
      ),
    );
    flash(
      results.some(({ error }) => error)
        ? 'Ordre non enregistré'
        : 'Ordre enregistré',
    );
  }
  return (
    <div className="links-layout">
      <section className="panel add-link-panel">
        <div className="control-heading">
          <h2>{editingId ? 'Modifier le contact' : 'Ajouter un contact'}</h2>
          {editingId && (
            <button
              className="text-button"
              onClick={() => {
                setEditingId(null);
                setLabel('');
                setValue('');
              }}
            >
              Annuler
            </button>
          )}
        </div>
        <div className="field-row two">
          <label>
            Plateforme
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              {platforms.map((item) => (
                <option key={item} value={item}>
                  {platformLabels[item]}
                </option>
              ))}
            </select>
          </label>
          <label>
            Libellé optionnel
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={platformLabels[platform]}
            />
          </label>
        </div>
        <label>
          Identifiant, numéro ou URL
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="@lucas ou https://…"
          />
        </label>
        <button className="button" onClick={saveLink} disabled={busy}>
          {busy ? (
            <Loader2 className="spin" size={17} />
          ) : editingId ? (
            <Save size={17} />
          ) : (
            <Plus size={17} />
          )}{' '}
          {editingId ? 'Enregistrer' : 'Ajouter'}
        </button>
      </section>
      <section>
        <div className="list-heading">
          <div>
            <h2>Mes contacts</h2>
            <p>Glissez les lignes pour modifier l’ordre public.</p>
          </div>
          <span>{links.length}</span>
        </div>
        {links.length ? (
          <DndContext collisionDetection={closestCenter} onDragEnd={dragEnd}>
            <SortableContext
              items={links.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="sortable-list">
                {links.map((link) => (
                  <SortableLink
                    key={link.id}
                    link={link}
                    onDelete={remove}
                    onToggle={toggle}
                    onEdit={edit}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="empty-state">
            <SocialIcon platform="custom" size={24} />
            <h3>Aucun lien pour le moment.</h3>
            <p>Ajoutez votre premier contact avec le formulaire.</p>
          </div>
        )}
      </section>
      {toast && (
        <output className="qard-toast" aria-live="polite">
          <Check size={15} />
          {toast}
        </output>
      )}
    </div>
  );
}
