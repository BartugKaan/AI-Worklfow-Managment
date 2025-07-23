type Agent = {
  agent_id: string
  user_id: string
  name: string
  description: string
  query_prompt: string
  system_prompt: string
  tool_selection_checkboxes: {
    name: string
    is_selected: boolean
  }
  created_date: Date
  updated_date: Date
}

export default Agent
