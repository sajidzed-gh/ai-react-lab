
# Civic lens
No UI, just API

A service endpoint '/api/civic-lens/semantic-search' to semantic search "text" from POPDataset (guides_projects.json) in PostgreSQl (Supabase)

Text is compared against embeddings of title key saved in POPDataSet. 

Below parameter to be passed to semantic search end point
{
    "record" : {
        "title" : "car breakins"
}

embeddings are  created once initially for 'title' using endpoint 'api/civic-lens/create-embeddings'







