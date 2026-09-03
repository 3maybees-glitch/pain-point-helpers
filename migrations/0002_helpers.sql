create table if not exists memberships (
  user_id      text primary key,
  plan         text not null,
  status       text not null default 'active',
  activated_at timestamptz not null default now()
);

create table if not exists helper_saves (
  id           text primary key,
  user_id      text not null,
  helper_id    text not null,
  title        text not null,
  values_json  jsonb not null default '{}'::jsonb,
  share_token  text unique,
  updated_at   timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

create index if not exists helper_saves_user_id_idx on helper_saves (user_id);
create index if not exists helper_saves_share_token_idx on helper_saves (share_token);
