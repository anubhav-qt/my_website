export type TargetType = 'scratchpad' | 'project';

export interface Topic {
  id: string;
  title: string;
  note: string | null;
  status: 'suggested' | 'in_production';
  submitted_at: string;
}

export interface Comment {
  id: string;
  target_type: TargetType;
  target_id: string;
  parent_id: string | null;
  nickname: string;
  body: string;
  created_at: string;
  deleted_at: string | null;
}
