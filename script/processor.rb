#!/usr/bin/env ruby

require 'yaml'
require 'kramdown'

# load HTML template
html_template = File.read('src/template.html')

Dir.glob('src/*.yml').each do |file|
  puts "Processing #{file}"

  template_data = YAML.load_file(file)

  # mutate body to HTML
  template_data['content'] = Kramdown::Document.new(template_data['content']).to_html

  # interpolate body into template
  html = html_template % template_data.transform_keys(&:to_sym)

  # write output
  File.write("dist/#{file.split('/').pop.gsub(/\.yml$/, '.html')}", html)
end
