#!/usr/bin/env ruby

require 'yaml'
require 'kramdown'

# load HTML template
# file needs to have `%{body}`, %{description}, etc. to be interpolated
html_template = File.read('template.html')

Dir.glob('*.yml').each do |file|
  puts "Processing #{file}"
  template_data = YAML.load_file(file)

  # what fields do we want in the src?
  # title
  # author
  # description
  # body

  # mutate body to HTML
  template_data['body'] = Kramdown::Document.new(template_data['body']).to_html

  # interpolate body into template
  html = html_template % template_data.transform_keys(&:to_sym)

  # write output
  File.write(Dir.join('dist', file.gsub(/\.yml$/, '.html')) , html)
end
