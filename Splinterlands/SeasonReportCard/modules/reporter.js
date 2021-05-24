function create_reporter(splinterlands) {

  async function generate_report() {
    await splinterlands.load_standard_data();



    return '<p>Loaded</p>'
  }

  return {
    generate_report
  };
}